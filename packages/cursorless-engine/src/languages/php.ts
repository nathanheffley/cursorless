import { Selection, TextEditor } from "@cursorless/common";
import type { SyntaxNode } from "web-tree-sitter";
import { SimpleScopeTypeType } from "@cursorless/common";
import { NodeMatcherAlternative, SelectionWithContext } from "../typings/Types";
import { patternFinder } from "../util/nodeFinders";
import {
  cascadingMatcher,
  createPatternMatchers,
  matcher,
  trailingMatcher,
} from "../util/nodeMatchers";
import { getNodeRange } from "../util/nodeSelectors";

/**
 * Given a node representing the text of a type cast, will return the
 * content range as the text inner type, and the outside range includes
 * the surrounding parentheses, so that "chuck type" deletes the parens
 * @param editor The editor containing the node
 * @param node The node to extract from; will be the content of the type cast without the surrounding parens
 * @returns The selection with context
 */
function castTypeExtractor(
  editor: TextEditor,
  node: SyntaxNode,
): SelectionWithContext {
  const range = getNodeRange(node);
  const contentRange = range;
  const leftParenRange = getNodeRange(node.previousSibling!);
  const rightParenRange = getNodeRange(node.nextSibling!.nextSibling!);
  const removalRange = range.with(leftParenRange.start, rightParenRange.start);

  return {
    selection: new Selection(contentRange.start, contentRange.end),
    context: {
      removalRange,
    },
  };
}

const nodeMatchers: Partial<
  Record<SimpleScopeTypeType, NodeMatcherAlternative>
> = {
  name: [
    "assignment_expression[left]",
    "class_declaration[name]",
    "function_definition[name]",
    "method_declaration[name]",
  ],
  type: cascadingMatcher(
    trailingMatcher(["~cast_expression[type]"]),
    matcher(patternFinder("cast_expression[type]"), castTypeExtractor),
  ),
};
export default createPatternMatchers(nodeMatchers);

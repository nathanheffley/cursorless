import { Command, HatTokenMap, IDE } from "@cursorless/common";
import { Snippets } from "../core/Snippets";
import { StoredTargetMap } from "../core/StoredTargets";
import { TestCaseRecorder } from "../testCaseRecorder/TestCaseRecorder";
import { ScopeProvider } from "@cursorless/common";

export interface CursorlessEngine {
  commandApi: CommandApi;
  scopeProvider: ScopeProvider;
  customSpokenFormGenerator: CustomSpokenFormGenerator;
  testCaseRecorder: TestCaseRecorder;
  storedTargets: StoredTargetMap;
  hatTokenMap: HatTokenMap;
  snippets: Snippets;
  injectIde: (ide: IDE | undefined) => void;
  runIntegrationTests: () => Promise<void>;
}

export interface CustomSpokenFormGenerator {
  /**
   * If `true`, indicates they need to update their Talon files to get the
   * machinery used to share spoken forms from Talon to the VSCode extension.
   */
  readonly needsInitialTalonUpdate: boolean | undefined;

  onDidChangeCustomSpokenForms: (listener: () => void) => void;
}

export interface CommandApi {
  /**
   * Runs a command.  This is the core of the Cursorless engine.
   * @param command The command to run
   */
  runCommand(command: Command): Promise<unknown>;

  /**
   * Designed to run commands that come directly from the user.  Ensures that
   * the command args are of the correct shape.
   */
  runCommandSafe(...args: unknown[]): Promise<unknown>;
}

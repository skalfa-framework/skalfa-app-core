import { Command } from "commander";
import { usePdf } from "./use-pdf";
import { blueprint } from "./blueprint";
import { logger } from "../logger";
import fs from "fs";
import path from "path";
import { exec, execSync, spawn } from "child_process";

// =====================================>
// ## Command: use-pdf
// =====================================>
export const usePdfCommand = new Command("use-pdf")
  .description("Copy pdf.worker.min.mjs ke folder public/")
  .action(() => {
    usePdf();
  });

// =====================================>
// ## Command: blueprint
// =====================================>
export const blueprintCommand = new Command("blueprint")
  .description("Generate blueprint")
  .option("-o, --only <names...>", "Run only specific blueprints")
  .action(async (opts: { only?: string[] }) => {
    await blueprint({ only: opts.only });
    logger.info("Success run all blueprints!");
    process.exit(0);
  });

// =====================================>
// ## Command: barrels (run once)
// =====================================>
export const barrelsCommand = new Command("barrels")
  .description("Generate barrels auto-imports using barrelsby")
  .action(() => {
    const rootDir = process.cwd();
    const configPath = path.join(rootDir, "barrels.json");

    if (!fs.existsSync(configPath)) {
      logger.error("barrels.json config file not found at project root");
      process.exit(1);
    }

    logger.info("Generating barrels...");
    try {
      execSync("npx barrelsby -c barrels.json", { cwd: rootDir, stdio: "inherit" });
      logger.info("Barrels successfully generated!");
      process.exit(0);
    } catch (err) {
      logger.error(`Failed to generate barrels: ${err}`);
      process.exit(1);
    }
  });

// =====================================>
// ## Command: watch:barrels (file watcher)
// =====================================>
export const watchBarrelsCommand = new Command("watch:barrels")
  .description("Watch directories and update barrels automatically on file changes")
  .action(async () => {
    const rootDir = process.cwd();
    const configPath = path.join(rootDir, "barrels.json");

    if (!fs.existsSync(configPath)) {
      logger.error("barrels.json config file not found at project root");
      process.exit(1);
    }

    let config: any = {};
    try {
      const configText = fs.readFileSync(configPath, "utf8");
      config = JSON.parse(configText);
    } catch (err) {
      logger.error(`Failed to parse barrels.json: ${err}`);
      process.exit(1);
    }

    const directories: string[] = Array.isArray(config.directory) ? config.directory : [config.directory];

    // Run barrels once at startup
    logger.info("Initializing barrels generation...");
    try {
      execSync("npx barrelsby -c barrels.json", { cwd: rootDir });
    } catch {}

    directories.forEach((dir) => {
      const absoluteDir = path.join(rootDir, dir);

      if (!fs.existsSync(absoluteDir)) {
        logger.error(`Barrels error: ${absoluteDir} directory not found`);
        return;
      }

      fs.watch(absoluteDir, { recursive: true }, (_, filename) => {
        if (filename && (filename.endsWith(".ts") || filename.endsWith(".tsx")) && filename !== "index.ts") {
          exec("npx barrelsby -c barrels.json", { cwd: rootDir }, (error) => {
            if (error) {
              logger.error(`Failed to update barrels for ${dir}: ${error.message}`);
            } else {
              logger.info(`Barrels updated: ${path.join(dir, "index.ts")}`);
            }
          });
        }
      });
    });

    logger.start("Barrels watcher running for: " + directories.join(", "));
  });

function getPackageManager(): string {
  const userAgent = process.env.npm_config_user_agent || "";
  if (userAgent.includes("yarn")) return "yarn";
  if (userAgent.includes("pnpm")) return "pnpm";
  if (userAgent.includes("bun")) return "bun";
  return "npm";
}

function executeCommand(commandLine: string): void {
  const child = spawn(commandLine, { stdio: "inherit", shell: true });
  child.on("exit", (code) => {
    process.exit(code || 0);
  });
}

export const devCommand = new Command("dev")
  .description("Start development server")
  .action(() => {
    const pm = getPackageManager();
    executeCommand(`concurrently --raw "${pm} run watch" "${pm} run skalfa watch:barrels"`);
  });

export const watchCommand = new Command("watch")
  .description("Start dev watch process")
  .action(() => {
    const pm = getPackageManager();
    executeCommand(pm === "bun" ? "bun next dev" : "next dev");
  });

export const buildCommand = new Command("build")
  .description("Build production bundle")
  .action(() => {
    executeCommand("next build");
  });

export const startCommand = new Command("start")
  .description("Start production server")
  .action(() => {
    executeCommand("next start");
  });

export const testCommand = new Command("test")
  .description("Run typescript compiler check")
  .action(() => {
    const pm = getPackageManager();
    executeCommand(pm === "bun" ? "bun tsc --noEmit" : "tsc --noEmit");
  });

export const lintCommand = new Command("lint")
  .description("Run eslint check")
  .action(() => {
    const pm = getPackageManager();
    executeCommand(pm === "bun" ? "bunx eslint app/* components/* utils/* contexts/*" : "eslint app/* components/* utils/* contexts/*");
  });

export function runCli() {
  const program = new Command();
  program.name("skalfa").description("Skalfa-app CLI").version("1.0.0");

  program.addCommand(usePdfCommand);
  program.addCommand(blueprintCommand);
  program.addCommand(barrelsCommand);
  program.addCommand(watchBarrelsCommand);
  program.addCommand(devCommand);
  program.addCommand(watchCommand);
  program.addCommand(buildCommand);
  program.addCommand(startCommand);
  program.addCommand(testCommand);
  program.addCommand(lintCommand);

  program.parse(process.argv);
}

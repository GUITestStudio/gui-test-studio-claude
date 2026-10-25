// Copyright (c) 2026 GUI Test Studio SARL. Released under the MIT licence (see LICENSE).
// GUI Test Studio for Claude - the plugin's launcher.
//
// Claude starts this file (.mcp.json: "node" and this path) and talks the Model Context Protocol over its standard
// streams. The server itself is gts-mcp.exe, installed WITH GUI Test Studio next to GUI Test Runner-Recorder (it needs
// the suite's engine, its DLLs, its models and the runner): this script only finds it and hands the streams over, so the
// extension stays a few kilobytes and every update of the suite updates the connector. Nothing is installed from here.
//
// Where it looks: Windows' registered App Path of GUI Test Runner-Recorder (what
// the installer writes, HKCU then HKLM - the folder gts-mcp.exe stands in), then the installer's default folder. Not found: it
// still answers Claude as a tiny MCP server whose one tool says what to install, so the person reads why instead of
// "server failed".
'use strict';
const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const EXE = 'gts-mcp.exe';
const RUNNER_EXE = 'GUI Test Runner-Recorder.exe';
const DOWNLOAD_URL = 'https://www.guiteststudio.com/download';

function fromAppPaths() {
  if (process.platform !== 'win32') return null;
  for (const hive of ['HKCU', 'HKLM']) {
    const key = `${hive}\\Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\${RUNNER_EXE}`;
    const result = spawnSync('reg.exe', ['query', key, '/ve'], { encoding: 'utf8', windowsHide: true });
    if (result.status !== 0 || !result.stdout) continue;
    const match = /REG_SZ\s+(.+)$/m.exec(result.stdout);
    if (!match) continue;
    const runner = match[1].trim();
    const candidate = path.join(path.dirname(runner), EXE);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function findServer() {
  const candidates = [];
  const registered = fromAppPaths();
  if (registered) candidates.push(registered);
  // The installer's default folder, for a computer whose App Path entry was removed (a per-user install always has one).
  candidates.push(path.join('C:\\Program Files', 'GUI Test Studio', 'Runner', EXE));
  for (const candidate of candidates) {
    if (candidate && fs.existsSync(candidate)) return candidate;
  }
  return null;
}

// The suite is not installed: a server of one tool, so the person is told what to do in Claude's own window.
function answerNotInstalled() {
  const message =
    `GUI Test Studio is not installed on this computer, so no test can be created or run yet. ` +
    `Tell the person to install it first from ${DOWNLOAD_URL} (give them this link), start it and sign in ` +
    `with a GUI Test Studio account on its free trial or a paid plan, then ask again. Nothing else needs to be set up.`;
  let buffer = '';
  const write = (object) => process.stdout.write(JSON.stringify(object) + '\n');
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (chunk) => {
    buffer += chunk;
    let newline;
    while ((newline = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      if (!line) continue;
      let request;
      try { request = JSON.parse(line); } catch (e) { continue; }
      if (request.id === undefined) continue; // a notification
      const reply = { jsonrpc: '2.0', id: request.id };
      if (request.method === 'initialize') {
        reply.result = {
          protocolVersion: (request.params && request.params.protocolVersion) || '2025-06-18',
          capabilities: { tools: {} },
          serverInfo: { name: 'gui-test-studio', version: '0.0.0' },
          instructions: message,
        };
      } else if (request.method === 'tools/list') {
        reply.result = { tools: [{ name: 'status', description: 'GUI Test Studio is not installed on this computer: this tool says where to download it.', inputSchema: { type: 'object', properties: {}, additionalProperties: false } }] };
      } else if (request.method === 'tools/call') {
        reply.result = { content: [{ type: 'text', text: message }], isError: true };
      } else if (request.method === 'ping') {
        reply.result = {};
      } else {
        reply.error = { code: -32601, message: 'Method not found' };
      }
      write(reply);
    }
  });
  process.stdin.on('end', () => process.exit(0));
}

const server = findServer();
if (!server) {
  answerNotInstalled();
} else {
  // The streams are handed over whole: the exe speaks to Claude directly, this process only outlives it to pass its
  // exit code on.
  const child = spawn(server, process.argv.slice(2), { stdio: 'inherit', windowsHide: true, cwd: path.dirname(server) });
  child.on('error', (error) => {
    process.stderr.write(`GUI Test Studio for Claude: ${server} could not be started: ${error.message}\n`);
    process.exit(1);
  });
  child.on('exit', (code, signal) => process.exit(signal ? 1 : (code === null ? 1 : code)));
  const forward = (signal) => () => { try { child.kill(signal); } catch (e) { /* already gone */ } };
  process.on('SIGINT', forward('SIGINT'));
  process.on('SIGTERM', forward('SIGTERM'));
  process.stdin.on('end', () => { /* the child reads the same stdin and ends by itself */ });
}

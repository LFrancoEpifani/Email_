import { exec } from 'child_process';
import { resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config(); 

export async function POST({ request }) {
  try {
    const { scriptName } = await request.json();
    const scriptPath = validateAndResolveScriptPath(scriptName);

    if (!scriptPath) {
      return new Response(JSON.stringify({ message: 'Invalid script name' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    const executionResult = await executeScript(scriptPath);
    return new Response(JSON.stringify({ message: executionResult }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error(`Error in script execution: ${error.message}`);
    return new Response(JSON.stringify({ message: 'An error occurred' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

function validateAndResolveScriptPath(scriptName) {
  const allowedScripts = ['analyze_emails.py', 'fetch_emails.py'];
  if (allowedScripts.includes(scriptName)) {
    const fullPath = resolve('./scripts', scriptName);
    console.log(`Resolved script path: ${fullPath}`);
    return fullPath;
  }
  return null;
}

function executeScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const pythonExe = process.env.PYTHON_EXE || 'python3';
    exec(`${pythonExe} ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Execution error: ${error.message}`);
        console.error(`Error code: ${error.code}`);
        console.error(`Signal received: ${error.signal}`);
        reject(`Error executing script: ${error.message}`);
      } else if (stderr) {
        console.error(`Script stderr: ${stderr}`);
        reject(`Script error: ${stderr}`);
      } else {
        console.log(`Script executed successfully. Output: ${stdout.trim()}`);
        resolve(stdout.trim());
      }
    });
  });
}



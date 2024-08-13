import { exec } from 'child_process';
import { resolve } from 'path';

export async function POST() {
  try {
    const scriptPath = validateAndResolveScriptPath('analyze_emails.py');

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
  const allowedScripts = ['analyze_emails.py'];
  if (allowedScripts.includes(scriptName)) {
    return resolve(scriptName);
  }
  throw new Error('Invalid script name');
}


function executeScript(scriptPath) {
  return new Promise((resolve, reject) => {
    exec(`python ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing script: ${error.message}`);
        reject(`Error executing script: ${error.message}`);
      } else if (stderr) {
        console.error(`Script stderr: ${stderr}`);
        reject(`Script error: ${stderr}`);
      } else {
        console.log(`Script stdout: ${stdout}`);
        resolve('Script executed successfully');
      }
    });
  });
}

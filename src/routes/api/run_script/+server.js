import { exec } from 'child_process';
import { resolve } from 'path';
import dotenv from 'dotenv';

dotenv.config(); 

export async function POST({ request }) {  
  try {
    const { emailId } = await request.json(); 
    const scriptPath = validateAndResolveScriptPath('analyze_emails.py');

    const executionResult = await executeScript(scriptPath, emailId);

    return new Response(JSON.stringify({ message: executionResult }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error in script execution:', error); 
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
    return fullPath;
  }
  return null;
}

function executeScript(scriptPath, emailId) {
  return new Promise((resolve, reject) => {
    const pythonExe = process.env.PYTHON_EXE || 'python3';
    exec(`${pythonExe} ${scriptPath} ${emailId}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Execution error: ${error.message}`);
        reject(`Error executing script: ${error.message}`);
      } else if (stderr) {
        console.error(`Script stderr: ${stderr}`);
        reject(`Script error: ${stderr}`);
      } else {
        resolve(stdout.trim());
      }
    });
  });
}

import { VM, VMScript } from 'vm2';

export default function vmProcess(script:string){
  const vm = new VM({
    timeout: 1000,
    allowAsync: false,
    eval: false,
    sandbox: {}
  });
  const scriptVM = new VMScript(script);
  try {
    return vm.run(scriptVM);
  } catch(err ) {
    if (err instanceof Error) {
      console.error(err);
      throw new Error(err.message)
    }
  }
}
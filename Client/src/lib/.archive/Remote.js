const ENDPOINT = `https://script.google.com/macros/s/AKfycbznWo6xaQyifin9k4FtPIPPxwgS-kp-XBTMxUd1AIIE04vcUrJY6BjQgyXPC7R2t5-B/exec`;
const Remote = (() => {
  const doGet = async (devicefileid, url = ENDPOINT) => {
    const params = new URLSearchParams();
    params.append('devicefileid', devicefileid);
    const response = await fetch(url + params.toString());
    
  }
})();
class Remote {
  constructor() {
    this.foo = '';
  }

  async doGet(devicefileid, url = ENDPOINT) {
    const params = new URLSearchParams();
    params.append('devicefileid', devicefileid);
    const response = await fetch(url + params.toString());
    
  }
  static async fileSync() {

  }
}

export default Remote;

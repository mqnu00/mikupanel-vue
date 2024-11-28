export function sysInfo(): Promise<string> {
    return new Promise((resolve, reject) => {
        try {
            const socket = new WebSocket("ws://localhost:8000/sysInfo");
          socket.onopen = () => {
              console.log("WebSocket连接已建立");
            };
            
            socket.onmessage = (event) => {
              console.log("接收到消息：" + event.data);
              resolve(event.data.toString())
              socket.close();
            };
            
            socket.onclose = () => {
              console.log("WebSocket连接已关闭");
            };
            
            socket.onerror = (error) => {
              console.error("WebSocket发生错误：" + error);
            };
          } catch (error) {
            reject(error);
          }
    })
}

export function getCpuUsage(onMessage: (data: string) => void): WebSocket {
    
    const socket = new WebSocket("ws://localhost:8000/cpu");

    // WebSocket 打开时
    socket.onopen = () => {
        console.log("WebSocket 连接已建立");
    };

    // 收到新消息时，调用传入的回调函数
    socket.onmessage = (event) => {
        // console.log("接收到消息：" + event.data);
        onMessage(event.data.toString()); // 将消息传递给调用方
    };

    // 发生错误时
    socket.onerror = (error) => {
        console.error("WebSocket 发生错误：", error);
    };

    // 连接关闭时
    socket.onclose = () => {
        console.log("WebSocket 连接已关闭");
    };

    return socket;
}

export function getMemoryUsage(onMessage: (data: string) => void): WebSocket {
    
  const socket = new WebSocket("ws://localhost:8000/memory");

  // WebSocket 打开时
  socket.onopen = () => {
      console.log("WebSocket 连接已建立");
  };

  // 收到新消息时，调用传入的回调函数
  socket.onmessage = (event) => {
      // console.log("接收到消息：" + event.data);
      onMessage(event.data.toString()); // 将消息传递给调用方
  };

  // 发生错误时
  socket.onerror = (error) => {
      console.error("WebSocket 发生错误：", error);
  };

  // 连接关闭时
  socket.onclose = () => {
      console.log("WebSocket 连接已关闭");
  };

  return socket;
}

export function getNetworkUsage(onMessage: (data: string) => void): WebSocket {
    
  const socket = new WebSocket("ws://localhost:8000/network");

  // WebSocket 打开时
  socket.onopen = () => {
      console.log("WebSocket 连接已建立");
  };

  // 收到新消息时，调用传入的回调函数
  socket.onmessage = (event) => {
      // console.log("接收到消息：" + event.data);
      onMessage(event.data.toString()); // 将消息传递给调用方
  };

  // 发生错误时
  socket.onerror = (error) => {
      console.error("WebSocket 发生错误：", error);
  };

  // 连接关闭时
  socket.onclose = () => {
      console.log("WebSocket 连接已关闭");
  };

  return socket;
}
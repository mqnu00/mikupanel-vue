import { BaseWebsocket } from "@/utils/BackendConnect";

export class LogReaderClient extends BaseWebsocket {

    public init = (logData: any) => {
        function parseLogLine(line: string): any {
            // 正则表达式匹配日志行和可能的多行错误堆栈跟踪
            const regex = /^\|(.+?)\|(.+?)\|(.+?)\|(.+?)\|pid: (\d+)\|tid: ([^|]+)\|(.+?)\|(.+?)\|Line (\d+)\|(.+)/;
            const match = line.match(regex);
            if (!match) {
                // 如果不匹配，可能是多行错误堆栈跟踪的开始
                return { errorStack: line };
            }

            const data: any = {
                timestamp: match[1],
                level: match[2],
                process: match[3],
                thread: match[4],
                pid: match[5],
                tid: match[6],
                file: match[7],
                function: match[8],
                line: match[9],
                message: match[10].slice(0, -1),
            };

            // 检查是否还有错误堆栈跟踪信息
            const errorStack = line.substring(match[0].length);
            if (errorStack.trim()) {
                data.errorStack = errorStack;
            }

            return data;
        }
        function processLogs(logs: string[]): any[] {
            const parsedLogs = [];
            let currentLog = '';

            let start = true;

            for (const line of logs) {
                if (line.startsWith('|')) {
                    start = false
                    // 如果当前行是日志的开始，解析前一个日志（如果有）
                    if (currentLog) {
                        parsedLogs.push(parseLogLine(currentLog));
                        currentLog = '';
                    }
                    currentLog = line;
                } else {
                    if (start) continue;
                    // 如果当前行是错误堆栈跟踪的一部分，追加到当前日志
                    currentLog += `\n${line}`;
                }
            }

            // 解析最后一个日志（如果有）
            if (currentLog) {
                parsedLogs.push(parseLogLine(currentLog));
            }

            console.log(parsedLogs)

            return parsedLogs;
        }
        this.socket.onopen = () => {
            this.wsSend({
                type: "run",
                component: "logReader"
            })
        }
        this.socket.onmessage = (ev: any) => {
            if (ev.data) {
                let info = JSON.parse(ev.data)
                if (info["do_return"] === 'read_log') {
                    logData.value = processLogs(info.data.logs)
                }
            }
        }
    }

    public getLog = () => {
        this.wsSend({
            do: "read_log"
        })
    }

    public close = () => {
        this.wsSend({
            do: "close"
        })
    }
}
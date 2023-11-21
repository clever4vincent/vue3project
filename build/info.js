import { readdir, stat } from "fs";

import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import pkg from "picocolors";

const { green, blue, bold } = pkg;
dayjs.extend(duration);

const staticPath = "dist";
const fileListTotal = [];

const recursiveDirectory = (folder, callback) => {
    readdir(folder, (err, files) => {
        if (err) throw err;
        let count = 0;
        const checkEnd = () => {
            ++count === files.length && callback();
        };
        files.forEach((item) => {
            stat(folder + "/" + item, async (err, stats) => {
                if (err) throw err;
                if (stats.isFile()) {
                    fileListTotal.push(stats.size);
                    checkEnd();
                } else if (stats.isDirectory()) {
                    recursiveDirectory(`${folder}/${item}/`, checkEnd);
                }
            });
        });
        files.length === 0 && callback();
    });
};

const sum = (arr) => {
    return arr.reduce((t, c) => {
        return t + c;
    }, 0);
};
const formatBytes = (a, b) => {
    if (a === 0) return "0 Bytes";
    const c = 1024;
    const d = b || 2;
    const e = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const f = Math.floor(Math.log(a) / Math.log(c));
    return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
};

export function viteBuildInfo() {
    let config;
    let startTime;
    let endTime;
    return {
        name: "vite:buildInfo",
        configResolved(resolvedConfig) {
            config = resolvedConfig;
        },
        buildStart() {
            console.log(bold(green(`👏欢迎使用${blue("[Z-POE]")}，现在正全力为您${config.command === "build" ? "打包" : "编译"}`)));
            if (config.command === "build") {
                startTime = dayjs(new Date());
            }
        },
        closeBundle() {
            if (config.command === "build") {
                endTime = dayjs(new Date());
                recursiveDirectory(staticPath, () => {
                    console.log(
                        bold(
                            green(
                                `恭喜打包完成🎉（总用时${dayjs.duration(endTime.diff(startTime)).format("mm分ss秒")}，打包后的大小为${formatBytes(
                                    sum(fileListTotal)
                                )}）`
                            )
                        )
                    );
                });
            }
        }
    };
}

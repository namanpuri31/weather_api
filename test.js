const http=require('http')
const fs=require('fs');
const requests=require("requests")
const path=require('path')

const homeFile=fs.readFileSync("home.html","utf-8")

const replaceVal=(tempval,orgval)=>{
    let temperature=tempval.replace("{%temperature%}",orgval.main.temp);
    temperature=temperature.replace("{%country%}",orgval.sys.country);
    temperature=temperature.replace("{%location%}",orgval.name);
    temperature=temperature.replace("{%tempstatus%}",orgval.weather[0].main);
    return temperature

}

const server=http.createServer((req,res)=>{
    if(req.url=='/'){
        requests("https://api.openweathermap.org/data/2.5/weather?q=hyderabad&appid=55b39fde20b92bf8237cea36bf484a55").on("data",(chunk)=>{
            const objdata=JSON.parse(chunk)
            const arrdata=[objdata]

            // console.log(arrdata[0].main.temp)
            const realTimeData=arrdata.map((val)=>replaceVal(homeFile,val)).join("");
            // console.log(realTimeData)
            res.write(realTimeData);
            console.log(realTimeData)
            })
        .on("end",(err)=>{
            if(err){
                console.log("connection has been closed due to backend issues",err)
            }
            res.end();
        })
    }
})
server.listen(8000,"127.0.0.1");
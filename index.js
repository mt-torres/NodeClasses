// const fs = require('fs');
// const http = require('http');


// ////////////////////////
// // Files
// // blocking, synchronous way
//     // const txtIn = fs.readFileSync('./txt/input.txt','utf-8');
//     // console.log(txtIn)

//     // const txtOut = `This is what we know about the avocado: ${txtIn}\nCreated on ${Date.now()}`;

//     // fs.writeFileSync('./txt/input.txt', txtOut);

//     // console.log('File written!');

// // Non-blocking, asynchronous way

//     // fs.readFile('./txt/start.txt','utf-8', (err, data1)=>{
//     //     fs.readFile(`./txt/${data1}.txt`,'utf-8', (err, data2)=>{
//     //         console.log(data2)  
//     //         fs.readFile(`./txt/append.txt`,'utf-8', (err, data3)=>{
//     //             console.log(data3) 
//     //             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`,'utf-8', err =>{
//     //                 console.log('Your file has been written!');
//     //             }) 
//     //         })
//     //     })
//     // })

//     // console.log('loading data....')  

// ////////////////////////
// // Server
// const server = http.createServer((req, res) => {
//     console.log(req)
//     res.end('Hello from the server')
// })

// server.listen(5000,'127.0.0.1', () => {
//     console.log('listening to requests on port 5000')

// })

const fs = require('fs')
const http = require('http');
const url = require('url');

//Server
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const dataObj =  JSON.parse(data);

function replaceTemplate(template, item){
    let output = template.replace(/{%PRODUCTNAME%}/g, item.productName);
    output = output.replace(/{%IMAGE%}/g, item.image);
    output = output.replace(/{%QUANTITY%}/g, item.quantity);
    output = output.replace(/{%PRICE%}/g, item.price);
    output = output.replace(/{%ID%}/g, item.id);
    output = output.replace(/{%FROM%}/g, item.from);
    output = output.replace(/{%NUTRIENTS%}/g, item.nutrients);
    output = output.replace(/{%DESCRIPTION%}/g, item.description);

    if(!item.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output
}
const server = http.createServer((req, res) =>{
    res.writeHead(200, {'Content-type': 'text/html'})
    // seguindo a doc do NODE
    // const location = req.headers.host + pathName;
    // const myUrl = new URL(location)
    // console.log(myUrl)
    //const idParam = myUrl.searchParams.get('id')

    //seguindo o professor
    const {query, pathname } = url.parse(req.url, true);
    const dataHTML =  dataObj.map(i => replaceTemplate(tempCard, i)).join('');
    console.log(pathname)
    console.log(query.id)
    

    if (pathname ==='/' || pathname ==='/overview'){
        const output = tempOverview.replace('{%PRODUCT_CARD%}', dataHTML);
        res.end(output)
        
    } else if (pathname === '/product'){
        console.log(query.id)
        const productObject = dataObj.filter(i=>i.id === +query.id);
        const output = replaceTemplate(tempProduct, productObject[0]);
        res.end(output);
    } else if (pathname ==='/api'){
        res.writeHead(200, {'Content-type': 'application/json'})
        res.end(data);   
    } else {
        res.writeHead(404,{
            'Content-type':'text/html',
            'my-own-header': 'Artemis&Baco'
        });
        res.end('<h1>The page could not be found</h1>')  
    }

})

server.listen(8000, '127.0.0.1', ()=>{
    console.log('Listening to requested on port 8000')
})


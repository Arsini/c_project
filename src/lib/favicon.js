import favicon from "img/favicon.ico"
; (function () {
    const node = document.querySelector('head')
    let newNode = document.createElement("link");//创建新节点
    newNode.setAttribute("href", favicon);
    newNode.setAttribute("rel", 'shortcut icon');
    node.appendChild(newNode);
})()
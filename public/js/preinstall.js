

(function () {
  var root = document.documentElement
  var userAgent = navigator.userAgent.toLowerCase()
  var dataset = root.dataset
  var rootClass = root.className
  // 获取并设置dpr
  dataset.dpr = window.devicePixelRatio
  // 初始化时屏幕高度与窗口高度差
  rootClass = (rootClass ? rootClass + ' ' : '') + ((dataset.screenWindowHeightDiff = screen.height - window.innerHeight) !== 0 ? 'non-immersive' : 'immersive')
  // Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/iphone x|hcoin/1.0.0
  // if (isIOSWebView()) rootClass += ' ios-webview'
 

  if (/(iphone|ipod|ipad)/i.test(userAgent) && isWeChatBrowser()) {
    navigator.isIOS = true
    rootClass += ' ios wechat' 
    if (/iphone\s*x/.test(userAgent)) rootClass += ' iphonex'
    
  } else {
    rootClass += ' non-ios'
  }
  root.className = rootClass

  function isWeChatBrowser() {
    const userAgent = navigator.userAgent;
    let back =  /MicroMessenger/i.test(userAgent);

    return back;
  }
})()

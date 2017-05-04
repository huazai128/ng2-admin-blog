//缓存数据,改成ts
export const store = (function(){
  let api = {},
      win = window,
      doc = win.document,
      localStorageName = 'localStorage',
      globalStorageName = 'globalStorage',
      storage;
  api.disabled = false;
  api.set = function(key,value){};
  api.get = function(key){};
  api.remove = function(key){};
  api.clear = function(){};  //清除所有
  api.transact = function(key,transactionFn){ //办理
    let val = api.get(key);
    if(typeof val == "undefined"){
      val = {}
    }
    transactionFn(val);
    api.set(key,val)
  };

  api.serialize = function(value){  //序列化数据
    return JSON.stringify(value);
  };

  api.deserialize = function(value){  //反序列化数据
    if(typeof value != "string"){ return undefined}
    return JSON.parse(value)
  };

  function isLocalStorageNameSupported() { //判断是否支持
    try { return (localStorageName in win && win[localStorageName]) }
    catch(err) { return false }
  }

  function isGlobalStorageNameSupported() {
    try { return (globalStorageName in win && win[globalStorageName] && win[globalStorageName][win.location.hostname]) }
    catch(err) { return false }
  }

  if (isLocalStorageNameSupported()) {//判断是否支持localStorage
    storage = win[localStorageName];
    api.set = function(key, val) { storage.setItem(key, api.serialize(val)) };
    api.get = function(key) { return api.deserialize(storage.getItem(key)) };
    api.remove = function(key) { storage.removeItem(key) };
    api.clear = function() { storage.clear() }

  } else if (isGlobalStorageNameSupported()) { //判断是否支持globalStorage
    storage = win[globalStorageName][win.location.hostname];
    api.set = function(key, val) { storage[key] = api.serialize(val) };
    api.get = function(key) { return api.deserialize(storage[key] && storage[key].value) };
    api.remove = function(key) { delete storage[key] };
    api.clear = function() { for (var key in storage ) { delete storage[key] } };

  } else if (doc.documentElement.addBehavior) {
    var storage = doc.createElement('div');
    function withIEStorage(storeFunction) {
      return function() {
        var args = Array.prototype.slice.call(arguments, 0);
        args.unshift(storage);
        // See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
        // and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
        doc.body.appendChild(storage);
        storage.addBehavior('#default#userData');
        storage.load(localStorageName);
        var result = storeFunction.apply(api, args);
        doc.body.removeChild(storage);
        return result
      }
    }
    api.set = withIEStorage(function(storage, key, val) {
      storage.setAttribute(key, api.serialize(val));
      storage.save(localStorageName)
    });
    api.get = withIEStorage(function(storage, key) {
      return api.deserialize(storage.getAttribute(key))
    });
    api.remove = withIEStorage(function(storage, key) {
      storage.removeAttribute(key);
      storage.save(localStorageName)
    });
    api.clear = withIEStorage(function(storage) {
      var attributes = storage.XMLDocument.documentElement.attributes;
      storage.load(localStorageName);
      for (var i=0, attr; attr = attributes[i]; i++) {
        storage.removeAttribute(attr.name)
      }
      storage.save(localStorageName)
    })
  } else {
    api.disabled = true
  }

  return api


});

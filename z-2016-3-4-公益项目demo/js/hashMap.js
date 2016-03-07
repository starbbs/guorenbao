
// 余效俭 2016-01-08 10:02:37 创建
// hashmap实现


define('hashMap', function() {
     //定义长度  
    var length = 0;  
    //创建一个对象  
    var obj = new Object();  
	var hashMap = {};
	
    /** 
    * 判断Map是否为空 
    */  
	var isEmpty=hashMap.isEmpty = function(){  
        return hashMap.length == 0;  
    };  
  
    /** 
    * 判断对象中是否包含给定Key 
    */  
    var containsKey=hashMap.containsKey=function(key){  
        return (key in obj);  
    };  
  
    /** 
    * 判断对象中是否包含给定的Value 
    */  
    hashMap.containsValue=function(value){  
        for(var key in obj){  
            if(obj[key] == value){  
                return true;  
            }  
        }  
        return false;  
    };  
  
    /** 
    *向map中添加数据 
    */  
    hashMap.put=function(key,value){  
        if(!this.containsKey(key)){  
            length++;  
        }  
        obj[key] = value;  
    };  
  
    /** 
    * 根据给定的Key获得Value 
    */  
    hashMap.get=function(key){  
        return this.containsKey(key)?obj[key]:null;  
    };  
  
    /** 
    * 根据给定的Key删除一个值 
    */  
    hashMap.remove=function(key){  
        if(this.containsKey(key)&&(delete obj[key])){  
            length--;  
        }  
    };  
  
    /** 
    * 获得Map中的所有Value 
    */  
    hashMap.values=function(){  
        var _values= new Array();  
        for(var key in obj){  
            _values.push(obj[key]);  
        }  
        return _values;  
    };  
  
    /** 
    * 获得Map中的所有Key 
    */  
    hashMap.keySet=function(){  
        var _keys = new Array();  
        for(var key in obj){  
            _keys.push(key);  
        }  
        return _keys;  
    };  
  
    /** 
    * 获得Map的长度 
    */  
    hashMap.size = function(){  
        return length;  
    };  
  
    /** 
    * 清空Map 
    */  
    hashMap.clear = function(){  
        length = 0;  
        obj = new Object();  
    };  
    
    return hashMap;
});

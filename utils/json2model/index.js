var classMap = {};
var _index = 1;

function parseClassMap(obj)
{
    if(!obj || typeof obj != "object")
    {
        return;
    }
    classMap["Class_" + _index] = obj;
    _index++;
    for(var key in obj)
    {
        if(key == null || key == undefined)
        {
            continue;
        }
        var val = obj[key];
        if(val == null || val == undefined)
        {
            continue;
        }
        if(typeof val == "object")
        {
            if(Array.isArray(val) && val.length > 0)
            {
                parseClassMap(val[0]);
            }
            else
            {
                parseClassMap(val);
            }
        }
    }
}

function getClassName(obj)
{
    for(var key in classMap)
    {
        if(classMap[key] == obj)
        {
            return key;
        }
    }
    var str = JSON.stringify(obj);
    for(var key in classMap)
    {
        if(JSON.stringify(classMap[key]) == str)
        {
            return key;
        }
    }
}

function convertJson2Model(str, nest = false)
{
    if(!str)
    {
        return "";
    }
    var nextLine = "\r\n";
    var tabs = "    ";

    var json = str;
    if(typeof str == "string")
    {
        json = JSON.parse(str);
    }
    if(!nest)
    {
        _index = 1;
        classMap = {};
        parseClassMap(json);
    }
    var results = "export class " + getClassName(json) + nextLine + "{";

    var objList = [];
    var nestObj = {};
    for(var _key in json)
    {
        if(_key == null || _key == undefined)
        {
            continue;
        }
        var _val = json[_key];
        if(_val == null || _val == undefined)
        {
            continue;
        }
        var _type = typeof _val;
        if(_type == "object")
        {
            if(Array.isArray(_val))
            {
                if(_val.length > 0)
                {
                    var className = getClassName(_val[0]);
                    nestObj[_key] = className;
                    results += nextLine + tabs + _key + ": Array<" + className + ">;";
                    objList.push(_val[0]);
                }
            }
            else
            {
                var className = getClassName(_val);
                nestObj[_key] = className;
                results += nextLine + tabs + _key + ": " + className + ";";
                objList.push(_val);
            }
        }
        else
        {
            results += nextLine + tabs + _key + ": " + _type + ";";
        }
    }
    if(objList.length > 0)
    {
        results += nextLine + tabs + "nestedPropertyMap()" + nextLine + tabs + "{";
        results += nextLine + tabs + tabs + "return {";
        for(var _key in nestObj)
        {
            results += nextLine + tabs + tabs + tabs + _key + ": " + nestObj[_key] + ",";
        }
        results += nextLine + tabs + tabs + "}" + nextLine + tabs + "}";
    }
    results += nextLine + "}" + nextLine;
    if(objList.length > 0)
    {
        for(var i = 0; i < objList.length; i++)
        {
            results += convertJson2Model(objList[i], true);
        }
    }
    return results;
}

// var a = {
// 	"status": "0",
// 	"message": "结果返回成功！",
// 	"total": 1,
// 	"results": [{
// 		"LSH": 74,
// 		"YHBH": "70098",
// 		"YHM": "xdzhangm",
// 		"YHXM": "张学东",
// 		"ZT": "1",
// 		"YHDW": null,
// 		"YHZW": null,
// 		"YHMM": "LFkCYdjB8kg=",
// 		"YHGL": null,
// 		"YHDWMC": null,
// 		"CityRole": null,
// 		"City": "130001",
// 		"Sex": 0,
// 		"UserNo": 70098,
// 		"PhoneNumber": "15827588285",
// 		"Email": "xdzhangm@isoftstone.com",
// 		"Position": "110020",
// 		"Department": "120011",
// 		"Rate": null,
// 		"isResources": 1
// 	}]
// };

// var r = convertJson2Model(a);
// console.log(r);
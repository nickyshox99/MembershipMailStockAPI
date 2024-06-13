var dbConn = require('../../config/db.config');
const Cryptof = require('./cryptof.model');

var MainModel = async function() {
    
};

MainModel.query = async function(sqlStr,result) 
{
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    return datas[0];
};

MainModel.queryFirstRow = async function(sqlStr,result) 
{
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    return datas[0][0]?datas[0][0]:[];
};

MainModel.insert = async function(tableName,data,result) { 
    try 
    {
        let sqlStr ="";
        let tmpColumn = "";        
        let tmpValue = "";
        let tmpQuestionMark="";

        for (const [key, value] of Object.entries(data)) 
        {
            if (tmpColumn==="") 
            {
                tmpColumn+= "`"+key+"`";
                tmpQuestionMark +="?";
            }
            else
            {
                tmpColumn+= ",`"+ key+"`";
                tmpQuestionMark += ",?";
            }
            
            if (value==null) 
            {
                if (tmpValue==="") 
                {
                    tmpValue+="null";
                }    
                else
                {
                    tmpValue+=",null";
                }
            }
            else if(typeof(value)=="string")
            {
                if (tmpValue==="") 
                {
                    tmpValue+=`'${value}'`;
                }    
                else
                {
                    tmpValue+=`,'${value}'`;
                }
            }
            else
            {
                if (tmpValue==="") 
                {
                    tmpValue+=`${value}`;
                }    
                else
                {
                    tmpValue+=`,${value}`;
                }
            }
        }

        sqlStr = `INSERT INTO ${tableName} (`;
        
        sqlStr += tmpColumn;
        sqlStr += `) VALUES (`;
        sqlStr += tmpValue;
        sqlStr += `)`;

        // console.log(sqlStr);
        // console.log(tmpValue);
    
        const datas = await dbConn.raw(sqlStr);
        
        return true;
    } catch (error) {
        console.log(error);
        return false;     
    }
       
}

MainModel.update = async function(tableName,data,condition,otherCondition="",result) { 
    try 
    {
        let sqlStr ="";
        let tmpWhere = "";        
        let tmpSet = "";

        for (const [key, value] of Object.entries(data)) 
        {            
            if (value==null) 
            {
                if (tmpSet==="") 
                {
                    tmpSet+= "`"+key+"`=null";
                }    
                else
                {
                    tmpSet+=",`"+key+"`=null";
                }
            }
            else if(typeof(value)=="string")
            {
                if (tmpSet==="") 
                {
                    tmpSet+= "`"+key+"`"+ `='${value}'`;
                }    
                else
                {
                    tmpSet+= ","+"`"+key+"`"+`='${value}'`;
                }
            }
            else
            {
                if (tmpSet==="") 
                {
                    tmpSet+= "`"+key+"`" +`=${value}`;
                }    
                else
                {
                    tmpSet+= ","+"`"+key+"`" +`=${value}`;
                }
            }
        }

        for (const [key, value] of Object.entries(condition)) 
        {  
            if (value==null) 
            {
                tmpWhere+= ` AND `+"`"+key+"`"+`=${value}`;
            }
            else if(typeof(value)=="string")
            {
                tmpWhere+= ` AND `+"`"+key+"`"+`='${value}'`;
            }
            else
            {
                tmpWhere+= ` AND `+"`"+key+"`" +`=${value}`;
            }
        }

        sqlStr = `UPDATE ${tableName} SET `;      
        sqlStr += tmpSet;  
        
        sqlStr += " WHERE 1=1 "    
        sqlStr += tmpWhere;
        sqlStr += otherCondition;
        
        //console.log(sqlStr);
        // console.log(tmpValue);
    
        const datas = await dbConn.raw(sqlStr);
        
        return true;
    } catch (error) {
        console.log(error);
        return false;     
    }
       
}

MainModel.delete = async function(tableName,condition,otherCondition="",result) { 
    try 
    {
        let sqlStr ="";
        let tmpWhere = "";        
        let tmpSet = "";
     

        for (const [key, value] of Object.entries(condition)) 
        {  
            if (value==null) 
            {
                tmpWhere+= ` AND `+key+`=${value}`;
            }
            else if(typeof(value)=="string")
            {
                tmpWhere+= ` AND `+key+`='${value}'`;
            }
            else
            {
                tmpWhere+= ` AND `+key +`=${value}`;
            }
        }

        sqlStr = `DELETE FROM ${tableName} `;      
        sqlStr += tmpSet;  
        
        sqlStr += " WHERE 1=1 "    
        sqlStr += tmpWhere;
        sqlStr += otherCondition;
        
        console.log(sqlStr);
        // console.log(tmpValue);
    
        const datas = await dbConn.raw(sqlStr);
        
        return true;
    } catch (error) {
        console.log(error);
        return false;     
    }
       
}

MainModel.getBankInfo = async function(bank_id,result) 
{
    let sqlStr = "SELECT * FROM bank_info WHERE bank_id="+bank_id;
    // console.log(sqlStr);
    const datas = await dbConn.raw(sqlStr);
    // console.log(datas);
    return datas[0]?datas[0]:[];
};

module.exports = MainModel;
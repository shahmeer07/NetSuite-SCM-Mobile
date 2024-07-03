/**
 * @NapiVersion 2.x
 * @NscriptType Restlet 
 */

define (["N/record" , "N/search" , 'N/log' , "N/runtime"] , function (record,search,log,runtime){

    function get(context){

        try {

        var currentuser = runtime.getCurrentUser()
        var currentuserid = currentuser.id
        log.debug("Current user id: " , currentuserid)
        
        var MassBinTransfersavedsearch = search.create({
            type: "customrecord_ks_mass_bin_transfer",
            filters: [
                ['custrecord_ks_mass_processed' , search.Operator.IS ,false], 'and',
                ['custrecord_ks_mass_create_bin_transfer' , search.Operator.IS ,false], 'and',
                ['owner' , search.Operator.IS , currentuserid]
            ] ,
            columns : [
                {name : "id"},
                {name : "custrecord_ks_customer"},
                {name : "custrecord_ks_project"},
                {name : "custrecord_ks_bin"},
                
            ]
        })


        var searchresults = MassBinTransfersavedsearch.run().getRange({ start: 0 , end: 1000}) 

        var results = searchresults.map(function(result){
            return {
                "Record ID" : result.getValue({ name: "id"}),
                "Customer" : result.getText({ name: "custrecord_ks_customer"}),
                "Project" : result.getValue({ name: "custrecord_ks_project"}),
                "Bin" : result.getValue({ name: "custrecord_ks_bin"}),
            }
        })
       
        log.debug("Search results: " , results)
        return results 

        
        }
        catch(error){
            log.error({
                title: 'Error: ',
                details: error.message
            })
        }

    }
    return {
        get: get
    }
})
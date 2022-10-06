class APIfilter{
    constructor(query , queryString){
        this.query = query
        this.queryString = queryString
    }

    filter(){
         // BUILD QUERRY
    // 1. FILTER
        let queryData = { ...this.queryString };
        const excludesFields = ['sort', 'limit', 'page', 'fields'];
        excludesFields.forEach((element) => delete queryData[element]);
     
        const queryString = JSON.stringify(queryData);
        queryData = JSON.parse(
          queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
        );
    
       this.query = this.query.find(queryData);
       return this
    }
    sort(){
          // 2 SORTING
        if (this.queryString.sort) {
        
            let sortString = this.queryString.sort.split(',').join(' ');
            this.query.sort(sortString);
        }else{
            
            this.query.sort("-createAt");
          }
       return this
    }
    fieldsLimit(){
        // 3 FIELD LIMITING
        if (this.queryString.fields) {
            let fields = this.queryString.fields.split(',').join(' ');
            this.query.select(fields);
        }else{
              this.query.select("-__v");

          }
       return this
    }
    pagination (){
            // 4. PAGINATION
        const page = Number(this.queryString.page)
        const limit = Number(this.queryString.limit)
        const skip = (page -1)* limit
        if (this.queryString.page) {
           
            this.query.skip(skip).limit(limit);
           
        }
        return this
    }

    limit(){
        // 5 . LIMIT
        if(this.queryString.limit){
            this.query.limit(this.queryString.limit)
        }
        return this
    }
}

module.exports =APIfilter
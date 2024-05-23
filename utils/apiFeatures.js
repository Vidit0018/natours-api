class APIFeatures{
    constructor(query,queryString){
      this.query = query ;
      this.queryString = queryString;
      console.log(this.queryString);
    }
  
    filter(){
  
      // 1. FILTERIGNG
      const queryObj = {...this.queryString}
      const excludeFields = ['page', 'sort' , 'limit','feilds']
      excludeFields.forEach(el=> delete queryObj[el]);
      
      // 2. ADVANCED FILTERING
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match => `$${match}`);
      // console.log(JSON.parse(queryStr));
  
      // console.log(req.query , queryObj);
      this.query = this.query.find(JSON.parse(queryStr))
      // let query =  Tour.find (JSON.parse(queryStr))
      return this;
    }
    sort(){
  
      if(this.queryString.sort){
        const sortBy = this.queryString.sort.split(',').join(' ');
        console.log(sortBy);
        this.query = this.query.sort(sortBy);
        console.log("sorting called")
      }
      else{
        this.query= this.query.sort('-createdAt')
      }
      
      return this;
    }
  
    limitFields(){
      if(this.queryString.fields){
        const fields = this.queryString.fields.split(',').join(' ');
        console.log(fields);
        this.query = this.query.select('name')
      }
  
      else{
        this.query = this.query.select('-__v');
      }
      return this;
    }
    paginate(){
       // 5. PAGINATION
       const page = this.queryString.page*1 || 1;
       const limit = this.queryString.limit*1 ||100;
       const skip = (page-1)* limit;
       this.query = this.query.skip(skip).limit(limit);
   
       
       return this;
    }
  }

  module.exports = APIFeatures;
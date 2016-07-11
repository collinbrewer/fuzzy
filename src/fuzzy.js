(function(){

   var Fuzzy=function(){

      var self=this;

      // register the fuzzy(wildcard) comparator
      self.config({
         compare: function(valueA, valueB){

            results || (results={});

            var type=typeof(valueA);

            results=self.getComparatorByType(type)(valueA, valueB);
         };
      });
   };

   /**
    * config
    * Configure
    * @param {Object} options
    *    type:
    */
   Fuzzy.prototype.config=function(options){

   };
})();

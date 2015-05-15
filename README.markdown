# Fuzzy
Fuzzy is an extensible utility for computing the likelihood of one value matching another.

This value can also be thought of as the *strength* of the match or the percent similar.  The highest possible value is 1.0 denoting an exact similarity, and the lowest value 0.0 denoting a complete opposite.

## Usage
The core method of Fuzzy is *compare*.

```javascript
var results=fuzzy.compare("Hello", "ello");

// results equals:
{
   path:       "/", // the path of the compared values
   type:  "string", // the type of values compared
   a:      "Hello", // the first value to be compared
   b:       "ello", // the second value to be compared
   comparator:  fn, // a reference to the comparator that was used
   minValue:     0, // the minimum amount of difference
   maxValue:     9, // the maximum amount of difference
   value:        1, // the actual amount of difference
   scale: "linear", // the scale
   strength: 0.89   // the strength of the match between values
}
```

For convenience, a few common operations are provided:

```javascript
fuzzy.strength("Hello", "ello"); // returns .89, the strength of the two values being a match

fuzzy.equals("Hello", "ello"); // returns true because .89 is greater than the default threshold 0.8

fuzzy.indexOfBestMatch("Hello", ["Mornin'", "Howdy", "Hello"]);
```

## Defaults
Fuzzy's comparators assign strength linearly(or very close)... that is to say that exact matches are assigned a strength of 1.0 and grow increasingly closer to 0.0 as the values get more and more different until they are exact opposites, at which point, the strength should be 0.0.

### Base Comparators
Below is a brief rundown of how each value type is compared in the default configuration.

**Strings**  
Strings are compared based on the number of characters that would need to be added and removed to make the strings exactly the same.  This computation is done relative to the length of the string because a one character change in a string that has only one character is more impactful than a one character change in a string that has thirty characters.

- **"Hello" and "Hello"** - No characters need to be changed, so this is a perfect score of 1.0.
- **"ABC" and "XYZ"** - Every character had to change

**Objects**  
Objects are compared by aggregating the results of all of the keys in the object.  Each key is weighted equally unless otherwise specified.

```javascript
fuzzy.compare({name:"Eric", age:29}, {name:"Eric", age:30});
```

**Number**  
Numbers are actually one of the more complicated comparisons because while they can be exactly the same, they can also grow infinitely apart, but you can compare infinity. Two numbers are the same when they are mathematically equal.  The match loses strength as the two numbers grow apart.  


## Configuration

Fuzzy and each comparator can be configured to support different functionality using the *config* method.

```javascript
fuzzy.config(options);
```

### Descriptions

- **Weight**: A value between 0.0 and 1.0 that is used to put more importance on a comparison than others.  For example, matching email addresses may be a stronger identifier of a match than first name, so it could be weighted higher.
- **Scale** The scale used to compute the strength of the value between the given minimum and maximum values.
- **Blacklist** A list of JSON Paths to be ignored in the comparisons.

#### Weight
Comparators can be


## Extensibility

Fuzzy also lets you hook into the comparator engine so you can decide just how fuzzy comparisons should be.  These extensions can be added per value type, per path, or on the fly for all values.

For example, if we want to compare two date values purely based on their year, we can override the base implementation for the "date" value type using:

```javascript
fuzzy.config({
   type:"date",
   comparator: function(value1, value2){
      return 1-((value1.getFullYear()-value2.getFullYear())/((new Date()).getFullYear()-1970));
   }
});
```
Another possibility is to score values based on an explicit property rather than contents or value implicitly.

In this example, we're comparing custom objects by a unique id property provided by a database.  Objects that have the same id are assigned a strength of 1.0 where objects that have even slightly different ids are assigned a strength of 0.0.  This example shows that Fuzzy's *fuzziness* isn't always so fuzzy(was he?).

```javascript
fuzzy.config({
   path:"/Todo",
   comparator: function(todoA, todoB){
      return (todoA.id===todoB.id ? 1.0 : 0.0);
   }
})
```

\*Also note in this example we're using the *path* directive which will only apply this comparator to

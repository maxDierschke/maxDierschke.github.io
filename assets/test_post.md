The markdown code to generate this HTML was copied from [markdownguide.org](https://www.markdownguide.org/cheat-sheet/).

# Working MD features

## This is a H2
### This is a H3

**This is some bold text**

`This is some code`

_This is some italic text_

~~This is striked through text~~

[This is a link to the posts page](https://maxdierschke.github.io/posts)


![an image](assets/test.jpg)


This is an ordered list:
1. First item
2. Second item
3. Third item

This is an unordered list:
- First item
- Second item
- Third item

This is a table:

| Syntax | Description |
| ----------- | ----------- |
| Header | Title |
| Paragraph | Text | 

This is a fenced code block:
```
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
``` 


This is a horizontal rule:

----------
</br>
</br>

# Features that don't work with the current MD parser

### This is a heading with custom id {#custom-id}
Expected:
<h3 id="custom-id">My Great Heading</h3>


Here's a sentence with a footnote. [^1]

[^1]: This is the footnote. 

Expected: 
The sentence with a footnote<sup id="fnref:1" role="doc-noteref"><a href="#fn:1" class="footnote" rel="footnote">1</a></sup>
<ol>
<li id="fn:1" role="doc-endnote">
      <p>This is the first footnote.&nbsp;<a href="#fnref:1" class="reversefootnote" role="doc-backlink">↩</a></p>
</li>
</ol>
This is a Definition list
term
: definition

Expected:
<dl>
  <dt>term</dt>
  <dd>definition</dd>
</dl>

This is a todo list:
- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media 

Expected: </br>
&#9744; Write the press release </br>
&#9745; Update the website </br>
&#9746; contact the media </br>


This is an emoji :joy: 
Expected: &#128514; 

This is a ==highlight== 
Expected <mark>highlight</mark>

This is a subscript H~2~O
Expected: H<sub>2<sub>O</sub></sub>


This is a superscript  	X^2^
Expected: X<sup>2</sup>

------

</br>
</br>

# Some lorem ipsum to check the layout

Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.   

Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi. Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.   

Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat. Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan et iusto odio dignissim qui blandit praesent luptatum zzril delenit augue duis dolore te feugait nulla facilisi.   



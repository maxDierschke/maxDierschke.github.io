I have been working in software engineering for over two years as of writing this, but so far I have never found the time to look into the build system of my main programming language, C++, in depth.
The reason for this was, on the one hand, my focus on other areas that had more impact on my development and, on the other hand, my lack of interest in the build system.
After all, algorithms and language-specifics are much more interesting to learn, right? </br>
Even at my day job, where I work on a rather large C++ code base, I rarely have to interact _directly_ with the build system as most of it is automated and abstracted away.

The motivation why I want to understand this topic *now* is that I want to go deeper on all aspects of software engineering in order to become a better engineer over all. 

Although *make* is abstracted away with *CMake* in many modern software projects, it is nevertheless interesting to look at *make* directly to gain a deeper understanding of the whole build system.

When I started to look into *make* for this article, I was mostly interested to learn how I could use it in projects, but I realized that I could also create a naive implementation of it to learn what it does under the hood.
So, happily, I can look into algorithms for this topic after all.

I used [the make manual](https://www.gnu.org/software/make/manual/make.pdf) as a reference for the intenals of *make*.</br>
This implementation is not meant to extend or even substitute *make*, but is merely an exercise in order to gain a better understanding of the most basic problem that *make* solves.

# What does *make* do?
Put into simple terms, *make* is utilized in order to automate the build process.

To run C and C++ programs, we need to create a binary executable from the source code. 
As anyone who has ever created any computer program knows, this is done with a compiler.
It is possible to compile a project with multiple files with a single command like this:

`g++ -o build/program.out src/main.cpp src/file_a.cpp src/file_b.cpp`

In this simple example, we utilize the _g++_ compiler to  compile the source files into the executable _build/program.out_.
As we can see in the example, we need to include all the individual source files in the command.
Doing this for a small project like in this example is straight forward, and recompilation is also not too time-consuming.
But as soon as the codebase grows, many more files need to be included in a recompilation.
The compilation time will grow with the project size, and anything would need to be compiled again anytime anything in the software changes.
This is pretty inefficient, as many parts of the compiled software would stay the same.
To reduce unnecessary recompilation, we can utilize intermediate results and only recompile what changed since the last compilation. </br>
![compilation](assets/implementing_a_make_clone/compilation.png)
The intermediate results we want to use for this are so-called object files (*.o* files).
These files are created for each source implementation file and need to be linked together to get the same output file that we created in a single step above.
When using *g++*, we can specify the *-c* flag to produce object files and skip the linking step.
To trigger the linker separately, we need to execute *g++* again, but with the object files as input.

Even though we now split the compilation into two steps, it would  be tedious to manually recompile specific object files depending on the files that changed.
This is where *make* comes into play. It detects changes of files and recompiles all object files that depend on it.
When thinking about solving this problem from an algorithmic point of view, we can come up with a graph structure that needs to be traversed.
In the following, we will discuss how we get to this graph structure (dependency graph) and how we can use well-known algorithms to only recompile what has changed.


# Dependency graph

Now that we understand the problem that *make* solves, we want to introduce the notion of *dependency*. 
Whenever we _#include_ some dependency _d_ in some file _f_, we can say that _f_ depends on _d_. So if something in _d_ changed, _f_ needs to be recompiled.
Dependency is a transitive relation, so we need to evaluate all dependencies recursively.
When we now specify the dependencies for all the files, we get a directed graph, which needs to be acyclic (directed acyclic graph).
In the following, we will utilize the example from [the make manual](https://www.gnu.org/software/make/manual/make.pdf).

![dependency](assets/implementing_a_make_clone/dependency.png)

Even in this small example that only contains 11 source files, we can see that it would be tedious to manually decide what to recompile when changes are introduced in some source files.

The way how the dependency graph is specified in _make_ is with _rules_ in a _makefile_.
The rules themselves have a *(file)name*, their *dependencies* and the *command* that needs to be executed for that specific rule.
The rule for main.o would look like the following:

```
main.o : main.c defs.h
    cc -c main.c
```

In this example, the name of the rule is _main.o_, it depends on _main.c_ and _defs.h_ and the command to create _main.o_ is _cc -c main.c_.
The name that is given to the rule should be the name of the output from the command, as this will be used to evaluate if the file corresponding to the rule is up-to-date or needs to be updated.

This is the simplest form of how rules in make-files can look like, however, *make* is also able to infer the build command for C and C++ files and supports additional syntactical sugar, which will be out of scope for this blog post.

We can now call `make main.o` to call the rule _main.o_. Make then needs to check if any of the transitive dependencies changed since the last invocation.
The build command for _main.o_ only needs to be run if any file corresponding to a rule in the subtree of _main.o_ was updated.

We can see that _make_ is able to simplify the build process, and in the next section I will discuss a naive implementation that I created to replicate the dependency-based execution of rules.

# MyMake implementation

My implementation can be found on [github](https://github.com/maxDierschke/myMake).

From a high level, the steps that need to be executed by _make_ are:
1. Parse rules from file 
2. Create a DAG from the rules 
3. DFS to recompile what changed

For my implementation, the parsing step is uninteresting so the language is simplified that it becomes csv like.

`main.o : main.c defs.h : cc -c main.c`

The name, dependencies and command are seperated by *:* and utilize one line per rule.
This way, the *myMakeFile* can be read line by line and individual rules only need to be split by *:* to be parsed to a C++ struct.

From a semantic point of view, each rule already represents a node in a graph.
The name and the command of the rule would be the node's properties, and the dependencies would be outgoing edges.

There are multiple different ways to organize graph structures, but for this simplistic implementation, we use a flat representation.
Each node is indexed by name and knows the name of all its dependencies.
To get from the list of names of a rule's dependencies to a list of rules, each individual dependency rule needs to be looked up by name in the indexing data structure.

The reason to use this graph representation is the considerably lower effort to parse it from the file to a usable C++ representation.
It does, on the other hand, also have some obvious downsides, so that, for example, any traversal needs to be aware of the implementation details.
In a more sophisticated implementation, we may want to expose an interface where we can get all child nodes for each rule directly, but this is out of the scope for this implementation.

Note, that we don't verify that the graph is acyclic, but an algorithm for this is a topic for a future blog article.

## Rule traversal with DFS

As mentioned in an earlier section, we need to evaluate if a change occurred anywhere in the whole subtree of a rule to determine if it has to be re-run.

![dependency_with_changes](assets/implementing_a_make_clone/dependency_with_changes.png)

If, for example, _command.h_ was changed, we need to recompile _command.o_, _kdb.o_ and _files.o_. 
Only after all of its dependencies are evaluated can we run the linking of the _edit_ step.


In pseudocode, this may look like the following:
```
bool update_if_dependencies_changed(rule, invocation_time = now(), maybe_parent_change_time = null):
    any_dependency_changed = false
    maybe_change_time = file_last_changed_or_null(rule.name)

    if(changed_after(maybe_change_time, invocation_time)):
        return true

    for(dependency : rule.dependencies):
        dependency_was_updated = 
            update_if_dependencies_changed(dependency, invocation_time, maybe_change_time)

        if(dependency_was_updated):
            any_dependency_changed = true
    
    if(any_dependency_changed 
        || !file_exists(rule.name)
        || changed_after(maybe_change_time, maybe_parent_change_time)):

        run rule.command
        return true

    return false
```

In order to check when a rule was last executed, we can utilize the information from the file system as it is pointed out in [the make manual](https://www.gnu.org/software/make/manual/make.pdf). 
To do this, we simply compare timestamps when a file was last modified.
If a dependency was modified after its parent, the parent needs to be updated. 
We can furthermore find out if subtrees have already been evaluated in the current run when comparing their update time to the time at which the top most parent rule was invoked.
Although we already know that a certain rule needs to be updated even if only one of its transitive dependencies changed, we can't stop early, as we still need to ensure to update all direct dependencies before updating the parent rule.

We can see that the pseudocode is pretty straight forward, and also the corresponding C++ code is not too complicated, as it can be seen in [my implementation](https://github.com/maxDierschke/myMake).

# Conclusion
We showed that *make* can be used to automate tasks that have dependencies between them.
The dependency structure needs to be specified in *makefile*. 

We went over a simple implementation that is able to evaluate a dependency structure as it is done by make.
It is pretty obvious that this naive implementation is very brittle and is only possible to be used in the intended way.

 </br></br></br>

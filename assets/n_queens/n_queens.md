This post was initially inspired by the [bit tricks lecture](https://www.youtube.com/watch?v=ZusiKXcz_ac&list=PLUl4u3cNGP63VIBQVWguXxZZi0566y7Wf&index=3) of MIT's software performance course and was supposed to talk about the way that the state space for the N-queens problem can efficiently be implemented with bit tricks. I realized during writing the post that there is a fair bit of detail in the N-queens problem and the backtracking algorithm so I decided to split the topic up into two posts.

This post will give an introduction to the backtracking algorithm and how we can apply it to N-queens. 
It then discusses a naive implementation of the state space for the N-queens problem.

The next post will then improve on the solution that is discussed in this post and will suggest a more efficient state space implementation.

# What is the N-Queens problem?

The N-Queens problem is the textbook example to convey the very well-known *backtracking* algorithm.
The problem is stated as a constraint satisfaction problem (CSP), where we want to place N queens on an NxN chessboard so that the queens are not able to attack each other.
While this problem is defined for any nonnegative integer, neither N=2 nor N=3 have a valid configuration. For N=0 and N=1, trivial solutions exist. Therefore, most research only considers the N-Queens problem for N>3. 

<img src="assets/n_queens/valid_configuration.png" height="250rem"/>

The N-Queens problem can either be stated as a question to find any single solution or to find all solutions that satisfy the constraints.
The backtracking algorithm is able to solve either of those and will be discussed in the following. 
We will only consider finding any solution in this post.

# What is backtracking?
Backtracking (BT) is a family of algorithms for exhaustive search, which can be utilized to find solutions for constraint satisfaction problems (CSP).
Besides the N-Queens problem, Sudoku is another example that can be solved with BT.

The main idea of the algorithm family is to partially solve the CSP in an iterative manner and take a step back when some constraint is violated.
In each iteration, the current configuration can be in one of three states:
* Problem satisfied (we found a solution)
* Constraints violated (we need to backtrack)
* Neither of the above (we continue to traverse the configuration space)

When considering backtracking, we can think of it like a traversal through the configuration tree. The tree is structured so that we are able to get to adjacent nodes when changing a single parameter, e.g., placing a single queen in our running example.

<img src="assets/n_queens/configuration_space.png" height="500rem"/>

The algorithm is easiest explained in a few lines of pseudo code:

```
maybe_solution_t backtrack(current_configuration):
    for configuration in get_child_configurations(current_configuration):
      if is_violating(configuration):
        continue 
      else if is_valid(configuration):
        return configuration
      maybe_solution = backtrack(configuration)
      if(maybe_solution.has_value()):
        return maybe_solution
  return 
```


The configuration tree is traversed from the root to the leaves. When a configuration is invalid or has no more children while itself not being valid, the algorithm traverses back to the parent and continues with adjacent configurations. 
To the avid reader it might be apparent that backtracking is related to depth-first search (DFS). In addition to a regular DFS, we are able to prune the configuration space during traversal, as we verify in each step that no constraints are violated. Something we have to keep in mind is that this only works as long as constraint violations are not recoverable. Otherwise we would prune possible solutions prematurely.

# Applying BT to N-Queens
In the previous section we have already seen what the configuration tree looks like for N=4. 

To implement the generic backtracking for a specific problem, we need to implement *get_child_configurations(config)*, *is_valid(config)*, and *is_violating(config)*. 
As I already pointed out in the introduction, we will only consider the naive implementation for those functions in this post and will improve on it in the follow-up post.

We don't need to completely start from zero and can consider a semi-naive solution. By the nature of the problem, we know that we can only place a single queen in each row. 
Therefore, we can represent our state space with an array of length N where the value represents the column the queen is placed in.

<img src="assets/n_queens/0312.png" height="250rem"/>

Considering the picture above, we can represent its state space as *[0, 3, 1, 2]*.

The function *get_child_configurations(config)* is trivial to implement for this solution and could simply return a configuration iterator, which generates configurations where the value of the current queen is incremented each time.
We can implement *is_valid(config)* as *!is_violating(config) && NQueensAreSet()*.

Therefore, *is_violating(config)* is the most interesting function to implement.
What we need to do in this case is to check for each queen if there is any other queen that it could attack. 
<img src="assets/n_queens/n_queens.png" height="250rem"/>

```
bool is_violating(configuration):
    for index = 1; index < number_of_placed_queens; index++:
      current_queen_placement = configuration[index]
      for queen_to_check = index-1; queen_to_check >= 0; queen_to_check--:
        checked_queen_placement = configuration[queen_to_check]
        if checked_queen_placement == current_queen_placement 
                                   || checked_queen_placement == (current_queen_placement + (index - queen_to_check))
                                   || checked_queen_placement == (current_queen_placement - (index - queen_to_check)):
          return true

    return false
```
We would then end up with *&sum;<sup>k</sup><sub>i=1</sub>3i* checks, where k is the number of placed queens. This results in a runtime of O(N<sup>2</sup>) for the is_violating function, when the whole state needs to be verified.

It was possible to implement the is_violating function pretty easily, but running it has a quadratic runtime, which is generally not what we would want.
This is somewhat of a cliffhanger, as we were able to easily construct an algorithm that solves the problem, but improving the actual computation will happen in the [next post](/post/bit_tricks). 




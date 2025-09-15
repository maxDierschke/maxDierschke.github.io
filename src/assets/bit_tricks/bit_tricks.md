This is the second post relating to the N-queens problem. 
In the last post we introduced the N-queens problem and the backtracking algorithm. 

This post will still utilize the backtracking algorithm but will improve the state space representation.
As mentioned in the last post, the idea for these posts was inspired by watching the [bit tricks lecture](https://www.youtube.com/watch?v=ZusiKXcz_ac&list=PLUl4u3cNGP63VIBQVWguXxZZi0566y7Wf&index=3) from the MIT software performance course, which I can highly recommend to anyone interested in software performance. 

When looking at software applications, there are multiple places where a wrong design can lead to bad performance.
All levels of the software have to work well together in order to be able to reach necessary performance requirements.
Performance is impacted by the programming language and the project architecture, on the algorithm level and on the implementation level.
While many performance issues need to be investigated in the context of a whole system, the topic of this blog post is relating to the algorithm level and its implementation details.

In this post I want to dive into the topic of bit tricks and will discuss how they can be utilized to improve performance.

# What is Bit Manipulation?

While this may sound vague, bit manipulation is the act of directly interacting with the binary representation of some values. Bit operations are cheap on the hardware level and map to single assembly instructions, assuming values are already loaded in registers (e.g., [AND](https://www.felixcloutier.com/x86/and)). 
Generally speaking, we want to make the most use of the hardware when we interact with values on this low level. 

One use case of bit tricks is to create branchless code. Branching can slow down code dramatically, especially in hot code paths. Each branch misprediction takes between 10 and 20 clock cycles, depending on the instruction pipeline length.  
The exact reasons are out of the scope of this post but can easily be found, e.g., on [Wikipedia](https://en.wikipedia.org/wiki/Branch_predictor).
A good example of branchless code is the following, which calculates the minimum of two numbers:

`r = y ^ ((x ^ y) & -(x < y));`

Although we lose readability compared to a branching comparison, we gain performance on the hardware level.
This example is very low level, and programmers are generally not advised to do those kinds of optimizations themselves. These optimizations are done by most compilers, and doing this manually may interfere with other optimizations. 

Although compilers are pretty smart nowadays, there are limits to what they are able to improve the performance on. Especially the higher-level algorithms and data structures cannot be optimized by compilers due to the vast search space. But this is the part where developers can leverage bit tricks themselves. 

The example we will talk about in the rest of the post is the representation of the state space for the N-queens problem.


# N-queens state space
In the [previous post](/post/n_queens), we already introduced that we are trying to place N-queens on an NxN chessboard, without them attacking each other.
We will keep using backtracking, which was introduced last time.
As described previously, we need to implement the functions *get_child_configurations(config)*, *is_valid(config)*, and *is_violating(config)*. 

Getting to the state space representation we want to consider in this post is a bit more complicated than the naive one.
Instead of tracking the *positions* of each queen, we now track a projection of the fields that are attacked by the queen. This way we only need to compare if a newly placed queen is on one of the already attacked fields.
For each direction that the queen can attack, we enumerate the fields so that fields that a queen can reach for that direction within a single move have the same value.

<img src="assets/bit_tricks/directions.jpg"/>

We can see in the picture, that we need 18 bits to represent a value in this way. For the general case, we need 2 * num_of_diagonals + n, where num_of_diagonals= 2n-1 for a total of 5n-2.
In this example we ignore the horizontal move of the queen, as we are always only placing one queen per row.
This configuration can be utilized on the base of single queens and can also be accumulated for multiple queens.
If we now consider the example configuration from the previous post: 

<img src="assets/n_queens/0312.png" height="250rem"/>

we remember that this representation was [0, 3, 1, 2].

The individual queens are now represented in hexadecimal as (0,0): 0x22008, (1,3): 0x04220, (2,1): 0x10404 and (3,2): 0x08108. 
(In this representation the index 0 is the most significant bit, but as long as we keep it consistent, it really does not matter in which order we want to map it.)
This projection operation is rather cheap, as it is only addition and bit-shift operations.

```
bit[] project(queen):
  column_projection = 1 << (queen.column )
  up_diagonal_projection = 1 << (queen.row + queen.column + 1 )
  down_diagonal_projection = 1 << (queen.row - queen.column - 1 + n)
  return (column_projetion << 2 * num_of_diagonals) 
    & (up_diagonal_projection << num_of_diagonals) 
    & down_diagonal_projection
```

The downside of this representation is that we can't properly display invalid configurations, but we rather need to evaluate if adding a certain queen would invalidate the configuration.
In order to check if some constraint is violated, we can utilize the binary AND to see if there is a bit set in two configurations that are compared.

```
bool is_violating(config):
  current_state_representation=0
  for index = 1; index < number_of_placed_queens; index++:
      current_queen_placement = configuration[index]
      current_queen_projection = project(current_queen_placement)
      if(current_state_representation & current_queen_projection):
        return true
      current_state_representation|= current_queen_projection
  return false
```

After we have done the *project(current_queen_placement)* operation once per queen, we only need to compare the value to the running state a single time, which is only a single binary operation. We can pretty clearly see why this state representation is so powerful. The runtime with this trick is now O(n), as we can compare the current queen to the whole accumulated state.

While we needed to check the placement for each queen agains all other already placed queens in the previous blog post, we only need to check the projection of the single queen against the accumulated state.

# Conclusion
We can see how this representation improved the asymptotic runtime dramatically. While getting to this kind of state representation might not be the first thing to think about, it nevertheless shows a great overall improvement. We have seen that working on the bit level may not be that complicated but has a large upside to code performance. 


---
title: "QUBO Solving ASIC"
description: "Notes on designing a custom ASIC for solving Quadratic Unconstrained Binary Optimization problems in hardware."
pubDate: 2026-09-08
tags: ["hardware", "optimization", "asic"]
---

## What is QUBO?

QUBO stands for Quadrature Unconstrained Binary Optimization. It's an unconstrained discrete optimization problem, a classic problem in quantum computing. 

The problem goes like this:
- We're given an n x n matrix $Q$ that encodes the weights of a min/max problem
	- This problem can usually be represented as a graph with nodes A,B,C... and weights N_1, N_2... across each node
	- Keep in mind that obtaining the $Q$ matrix from a graph problem is itself a tricky problem. Usually the problems involve the relationship between nodes, themselves, and their neighbors, so we can usually represent "self weights" in the diagonal, and "relationship weights" in the non-diagonal. This may not always be the case. 
	- For the rest of the project, we should assume we already have a correct $Q$ 
	- $Q$ is usually symmetrical
- We are trying to solve $\text{argmin}_{x}(x^T Qx)$ 
	- $x$ is an n x 1 column vector that represents the "binary solutions" of QUBO. $x_{i} \in {0,1}$
		- In the problem, $x$ usually describes an optimal combination of weights in the graph. Because these are "presence of weights," they are usually a 1 or 0, as in no presence or all presence. This is where "binary" comes in. 
- So we go from a matrix, to a minimization of an equation. This is the "cost function" that we are minimizing.
	- You can check that the result of $x^T Q x$ is a scalar and not a vector or matrix 

We can relate the QUBO problem to the Ising Hamiltonian for a Quantum system
- The ISING Hamiltonian represents the energy state of $N$ electrons with spins. A spin can be either a +1 (up spin) or -1 (down spin). 
	- $H(s) = C+h^Ts + \frac{1}{2} s^TJs$
		- $s$ is an n x 1 vector representing the spin states of all electrons
		- $h$ is a vector of "external magnetic fields" that can influence the strength of each individual spin 
		- $J$ is a matrix that encodes interactions between different spins. For example, spin 1 and spin 2 can have a relationship $J_{12}$. 
	- $H(s)$ describes the energy state of the system with N electrons, each with a +1 or -1 spin
		- $H(s)$ wants to be minimized such that the system can be at its lowest energy state. That means each electron should be configured in its OPTIMAL SPIN STATE such that the system has the least energy. 
- You may notice that the Ising Hamiltonian and the QUBO $\text{argmin}$ have very similar forms. 
	- In fact, they're exactly mappable onto each other. 
	- The important part is that they're both binary optimization functions that input matrix problems and output vector solutions. For QUBO, the solution is a vector of binary values representing weights that minimize the cost function. For the Ising Hamiltonian, the solution is a vector of +1 or -1 representing the spins of the electrons such that the system has least energy. 
- In fact, the QUBO argmin and the Ising hamiltonian are exactly related by the relationship $s = \frac{x+1}{2}$ 
	- The above relationship turns a QUBO binary into a spin state in the Ising Hamiltonian
	- If you substitute $x$ for $s$ with that relationship, you get a solution exactly in the form of the Ising Hamiltonian 

Relationships:
- $h = \frac{1}{2}Q (1)$ 
- $J = \frac{1}{2}Q$ with no diagonals.
- So we can construct $H(s) = h^Ts + \frac{1}{2}s^TJs$ from just $Q$ 

## Simulated Annealing

To summarize from the previous part:
- QUBO Problem → Q matrix → $\text{argmin}_{x}(x^T Qx)$ → $\text{argmin}_{s}(H(s))$ 

We now have an evaluation function $H(s)$ that inputs a proposed solution $s$ and outputs energy $H(s)$. These are all the building blocks you need for meta-heuristic optimization. 

Why Simulated Annealing?
- For a greedy algorithm like gradient descent, you choose the path of least resistance 100% of the time. As in, you always "follow the gradient." This is great for convex and convex-like problems because you always know that the local minimum is also the global minimum. 
- But for many discrete optimization problems, the energy landscape is somewhat more complicated, and gets much more complicated the larger the dataset is. Therefore, greedy methods like gradient descent will fail to capture the global minimum (or even an approximate global minimum) almost 100% of the time. 
- This is where meta-heuristic methods become advantageous. The central premise of this is: 
	- You will lose the deterministic time complexity. In exchange, you get a probabilistic advantage by strategically inserting randomness. 
	- Simulated Annealing is a meta-heuristic that bets on "probabilistic convergence." As in, the acceptance of non-greedy steps follows a converging probabilistic model. You are therefore more likely to find the global solution because you cover more of the solution space by allowing non-greedy steps. 
- In the world of meta-heuristics, time complexity is thrown out the window. Instead, the benchmark is time. 

Explaining Simulated Annealing
- We start with a randomized solution $s_{0}$. We can evaluate this solution with $H(s_{0}) = H_{0}$. These are the initial variables.
- $\alpha$ is the cooling rate, which can be tuned. 
- Loop:
	- Start
	- Randomize one of the spin states of $s_{0}$ to make $s_{1}$. Then find $\nabla H = H_{1} -H_{0}$ 
	- If $\nabla H \le 0$, accept the spin change
	- If $\nabla H>0$, conditionally accept the spin change according to the model $P = e^{-\alpha\cdot\nabla H/T}$ where $T$ is the "temperature" of the loop at a given step 
	- $T_{new} = T_{old} \cdot \alpha$
	- End
- At the end of the loop, the temperature will have gone down to a threshold $T_{min}$. 

This is the algorithm we'll be using, the algorithm at the core of the computation. 


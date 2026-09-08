---
title: "QUBO Solving ASIC"
description: "Notes on designing a custom ASIC for solving Quadratic Unconstrained Binary Optimization problems in hardware."
pubDate: 2026-09-08
tags: ["hardware", "optimization", "asic"]
---

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



import { mapnode } from "./mapnode";
import PriorityQueue from "priorityqueuejs";

export class pathfinding {
  /**
   * breadthFirstSearch function that returns a path between two nodes
   * @param root the start node
   * @param goal the end node
   * @returns currently just the end node if found. Will eventually be the path between the two nodes
   */
  static breadthFirstSearch(root: mapnode, goal: mapnode): mapnode[] {
    const queue: { curNode: mapnode; path: mapnode[] }[] = [];
    const visited: string[] = [];

    queue.push({ curNode: root, path: [root] });
    while (queue.length > 0) {
      const { curNode, path } = queue.shift()!;
      if (curNode.getNodeID() == goal.getNodeID()) {
        return path;
      }
      for (const neighbor of curNode.getEdges()) {
        if (!visited.includes(neighbor.getNodeID())) {
          visited.push(neighbor.getNodeID());
          queue.push({ curNode: neighbor, path: [...path, neighbor] });
        }
      }
    }

    return [];
  }

  /**
   * aStar function that returns a path between two nodes using the A* algorithm
   * @param root start node
   * @param goal goal node
   */
  static aStar(root: mapnode, goal: mapnode): mapnode[] {
    const priorityQueue = new PriorityQueue<nodePath>(
      (a, b) => a.cost - b.cost,
    );
    const visited: string[] = []; //push root

    priorityQueue.enq(new nodePath(root, [root], 0));
    visited.push(root.getNodeID());
    while (!priorityQueue.isEmpty()) {
      const nodeP = priorityQueue.deq(); //grab highest priority (lowest Dist)
      const currNode = nodeP.node;
      const path = nodeP.path;
      const priority = nodeP.cost;
      if (currNode.getNodeID() == goal.getNodeID()) {
        return path;
      }

      for (const neighbor of currNode.getEdges()) {
        if (!visited.includes(neighbor.getNodeID())) {
          visited.push(neighbor.getNodeID());
          const newPriority =
            priority +
            this.pythDist(neighbor, goal) +
            this.floorDist(neighbor, goal) +
            this.manHatt(neighbor, goal);
          priorityQueue.enq(
            new nodePath(neighbor, [...path, neighbor], newPriority),
          );
        }
      }
    }

    return [];
  }

  /**
   * pythDist function: calculates the distance between two nodes using the Pythagorean Theorem
   * @param currNode start node
   * @param goal end node
   */
  static pythDist(currNode: mapnode, goal: mapnode): number {
    return Math.sqrt(
      Math.pow(currNode.getCord().x - goal.getCord().x, 2) +
        Math.pow(currNode.getCord().y - goal.getCord().y, 2),
    );
  }

  /**
   * floorDist function: calculates the distance between two nodes in terms of floors
   * @param currNode start node
   * @param goal end node
   */
  static floorDist(currNode: mapnode, goal: mapnode): number {
    return 100 * Math.abs(currNode.getFloor() - goal.getFloor());
  }

  /**
   * manHatt function: calculates the Manhattan Distance (Stepping)
   * @param currNode start node
   * @param goal end node
   */
  static manHatt(currNode: mapnode, goal: mapnode): number {
    return (
      Math.abs(currNode.getCord().x - goal.getCord().x) +
      Math.abs(currNode.getCord().y - goal.getCord().y)
    );
  }
}

class nodePath {
  node: mapnode;
  path: mapnode[];
  cost: number;
  constructor(node: mapnode, path: mapnode[], cost: number) {
    this.node = node;
    this.path = path;
    this.cost = cost;
  }
}

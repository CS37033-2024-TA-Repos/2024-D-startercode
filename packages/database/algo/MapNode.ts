export class MapNode {
  //Descriptions above the constructor
  private nodeID: string;
  private xcord: number;
  private ycord: number;
  private floor: string;
  private building: string;
  private nodeType: string;
  private longName: string;
  private shortName: string;
  private edges: MapNode[] = [];

  /**
   * Constructor for MapNode
   * @param nodeID first char team letter lowercase, rest upper with next 4 being node type, next 3 is number of that node on floor, last is floor 01, L2, L1 etc.
   * @param xcord x coordinate
   * @param ycord y coordinate
   * @param floor floor of room
   * @param building which building it is in
   * @param nodeType type of node, hallway, conf, etc.
   * @param longName actual name of room
   * @param shortName short name of room
   */
  constructor(
    nodeID: string,
    xcord: number,
    ycord: number,
    floor: string,
    building: string,
    nodeType: string,
    longName: string,
    shortName: string,
  ) {
    this.nodeID = nodeID;
    this.xcord = xcord;
    this.ycord = ycord;
    this.floor = floor;
    this.building = building;
    this.nodeType = nodeType;
    this.longName = longName;
    this.shortName = shortName;
  }

  /**
   * addEdge public function that adds a MapNode to the current Node Edges list
   * @param edge the MapNode that will be added to edges
   */
  public addEdge(edge: MapNode): void {
    this.edges.push(edge);
  }

  /**
   * addListOfEdges adds a list of type MapNode to add to the current Node Edges list
   * @param list the list of type MapNode that will be added to edges
   */
  public addListOfEdges(list: MapNode[]) {
    while (list.length != 0) {
      this.addEdge(list.pop() as MapNode);
    }
  }

  /**
   * getEdges public function that returns a Node's edges (Neighbors)
   * @param(void) : None
   * @returns this.edges which is a MapNode[] a list of all MapNode that are edges
   */
  public getEdges(): MapNode[] {
    return this.edges;
  }

  /**
   * getNodeID public function that returns the node's ID
   * @param(void) : None
   * @returns this.nodeID which is a string
   */
  public getNodeID(): string {
    return this.nodeID;
  }

  /**
   * getCord public function that returns the node's coordinates
   */
  public getCord(): { x: number; y: number } {
    return { x: this.xcord, y: this.ycord };
  }

  /**
   * getCordData public function that returns the node's ID and coordinates
   */
  public getCordData(): { nodeID: string; x: number; y: number } {
    return { nodeID: this.nodeID, x: this.xcord, y: this.ycord };
  }

  public getFloor(): number {
    if (this.floor == "L1") return -1;
    else if (this.floor == "L2") return -2;
    return parseInt(this.floor);
  }
}

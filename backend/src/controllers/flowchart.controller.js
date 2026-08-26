import {
  COLOR_PALETTE,
  FLOWCHART_CONTAINERS,
  FLOWCHART_NODES,
  FLOWCHART_EDGES,
  MERMAID_FLOWCHART_DEFINITION
} from '../data/flowchartData.js';

/**
 * Get entire flowchart graph model
 */
export const getFullFlowchart = (req, res) => {
  try {
    const { role } = req.query;

    let filteredNodes = FLOWCHART_NODES;
    let filteredEdges = FLOWCHART_EDGES;

    if (role && role !== 'all') {
      filteredNodes = FLOWCHART_NODES.filter(
        node => node.role === role || node.role === 'shared' || (role === 'tenant' && node.role === 'public')
      );
      const nodeIds = new Set(filteredNodes.map(n => n.id));
      filteredEdges = FLOWCHART_EDGES.filter(
        edge => nodeIds.has(edge.source) && nodeIds.has(edge.target)
      );
    }

    const stats = {
      totalNodes: FLOWCHART_NODES.length,
      totalEdges: FLOWCHART_EDGES.length,
      publicScreens: FLOWCHART_NODES.filter(n => n.category === 'public').length,
      tenantScreens: FLOWCHART_NODES.filter(n => n.category === 'tenant').length,
      ownerScreens: FLOWCHART_NODES.filter(n => n.category === 'owner').length,
      decisionPoints: FLOWCHART_NODES.filter(n => n.category === 'decision').length,
      sharedSyncPoints: FLOWCHART_NODES.filter(n => n.role === 'shared').length
    };

    res.status(200).json({
      status: 'success',
      data: {
        appName: 'RentEasy',
        version: '2.0.0',
        palette: COLOR_PALETTE,
        containers: FLOWCHART_CONTAINERS,
        nodes: filteredNodes,
        edges: filteredEdges,
        stats
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get Mermaid graph definition string
 */
export const getMermaidDiagram = (req, res) => {
  try {
    res.status(200).json({
      status: 'success',
      data: {
        mermaid: MERMAID_FLOWCHART_DEFINITION
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

/**
 * Get individual node specs by ID
 */
export const getNodeById = (req, res) => {
  try {
    const { id } = req.params;
    const node = FLOWCHART_NODES.find(n => n.id === id);

    if (!node) {
      return res.status(404).json({
        status: 'fail',
        message: `Node with id '${id}' not found`
      });
    }

    const incomingEdges = FLOWCHART_EDGES.filter(e => e.target === id);
    const outgoingEdges = FLOWCHART_EDGES.filter(e => e.source === id);

    res.status(200).json({
      status: 'success',
      data: {
        node,
        incoming: incomingEdges,
        outgoing: outgoingEdges
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
};

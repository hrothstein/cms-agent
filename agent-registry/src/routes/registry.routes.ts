/**
 * Registry API Routes
 */

import { Router, Request, Response } from 'express';
import { RegistryService } from '../services/RegistryService';

const router = Router();
const registryService = new RegistryService();

/**
 * Register a new agent
 * POST /api/v1/agents/register
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { endpoint } = req.body;

    if (!endpoint) {
      return res.status(400).json({
        success: false,
        error: 'endpoint is required',
      });
    }

    const registered = await registryService.registerAgent(endpoint);

    res.json({
      success: true,
      data: {
        agentId: registered.agentCard.id,
        name: registered.agentCard.name,
        status: registered.status,
        registeredAt: registered.registeredAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to register agent',
    });
  }
});

/**
 * Unregister an agent
 * DELETE /api/v1/agents/:agentId
 */
router.delete('/:agentId', (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;

    const success = registryService.unregisterAgent(agentId);

    if (!success) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found',
      });
    }

    res.json({
      success: true,
      message: 'Agent unregistered successfully',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to unregister agent',
    });
  }
});

/**
 * Get an agent by ID
 * GET /api/v1/agents/:agentId
 */
router.get('/:agentId', (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;

    const agent = registryService.getAgent(agentId);

    if (!agent) {
      return res.status(404).json({
        success: false,
        error: 'Agent not found',
      });
    }

    res.json({
      success: true,
      data: agent,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get agent',
    });
  }
});

/**
 * Get all agents
 * GET /api/v1/agents
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const { status, capability, skill } = req.query;

    let agents;

    if (status) {
      agents = registryService.getAgentsByStatus(status as any);
    } else if (capability) {
      agents = registryService.findAgentsByCapability(capability as string);
    } else if (skill) {
      agents = registryService.findAgentsBySkill(skill as string);
    } else {
      agents = registryService.getAllAgents();
    }

    res.json({
      success: true,
      data: agents,
      count: agents.length,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get agents',
    });
  }
});

/**
 * Health check an agent
 * POST /api/v1/agents/:agentId/health
 */
router.post('/:agentId/health', async (req: Request, res: Response) => {
  try {
    const { agentId } = req.params;

    const healthy = await registryService.healthCheckAgent(agentId);

    res.json({
      success: true,
      data: {
        agentId,
        healthy,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Health check failed',
    });
  }
});

/**
 * Health check all agents
 * POST /api/v1/agents/health/all
 */
router.post('/health/all', async (req: Request, res: Response) => {
  try {
    await registryService.healthCheckAll();

    res.json({
      success: true,
      message: 'Health checks completed',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Health checks failed',
    });
  }
});

/**
 * Get registry statistics
 * GET /api/v1/stats
 */
router.get('/stats', (req: Request, res: Response) => {
  try {
    const stats = registryService.getStatistics();

    res.json({
      success: true,
      data: stats,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to get statistics',
    });
  }
});

// Export both router and service instance
export { router as registryRouter, registryService };


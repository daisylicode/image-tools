/**
 * Worker Pool Manager
 * Manages multiple web workers for parallel processing
 */
export class WorkerPool {
  constructor(workerScript, poolSize = navigator.hardwareConcurrency || 4) {
    this.workerScript = workerScript
    this.poolSize = poolSize
    this.workers = []
    this.taskQueue = []
    this.activeWorkers = new Set()
    
    this.init()
  }

  init() {
    for (let i = 0; i < this.poolSize; i++) {
      this.createWorker()
    }
  }

  createWorker() {
    const worker = new Worker(this.workerScript)
    worker.id = Date.now() + Math.random()
    worker.busy = false
    
    worker.onmessage = (e) => {
      this.handleWorkerMessage(worker, e)
    }
    
    worker.onerror = (error) => {
      console.error('Worker error:', error)
      this.handleWorkerError(worker)
    }
    
    this.workers.push(worker)
    return worker
  }

  async execute(data, transferables = []) {
    return new Promise((resolve, reject) => {
      const task = { data, resolve, reject, transferables }
      
      // Try to find an available worker
      const availableWorker = this.workers.find(w => !w.busy)
      
      if (availableWorker) {
        this.executeTask(availableWorker, task)
      } else {
        // Add to queue
        this.taskQueue.push(task)
      }
    })
  }

  executeTask(worker, task) {
    worker.busy = true
    this.activeWorkers.add(worker)
    
    try {
      worker.postMessage(task.data, task.transferables)
    } catch (error) {
      this.handleWorkerError(worker)
      task.reject(error)
    }
  }

  handleWorkerMessage(worker, e) {
    worker.busy = false
    this.activeWorkers.delete(worker)
    
    // Find the task for this worker and resolve it
    const taskIndex = this.taskQueue.findIndex(t => 
      t.data.taskId === e.data.taskId
    )
    
    if (taskIndex !== -1) {
      const task = this.taskQueue.splice(taskIndex, 1)[0]
      task.resolve(e.data)
    } else {
      // If no task found, resolve with the data
      // This handles cases where worker sends unsolicited messages
      console.warn('Received message from worker without matching task:', e.data)
    }
    
    // Process next task in queue
    this.processQueue()
  }

  handleWorkerError(worker) {
    worker.busy = false
    this.activeWorkers.delete(worker)
    
    // Find and reject the task for this worker
    const taskIndex = this.taskQueue.findIndex(t => t.worker === worker)
    if (taskIndex !== -1) {
      const task = this.taskQueue.splice(taskIndex, 1)[0]
      task.reject(new Error('Worker error'))
    }
    
    // Terminate and recreate the worker
    this.terminateWorker(worker)
    const newWorker = this.createWorker()
    
    // Process next task
    this.processQueue()
  }

  processQueue() {
    if (this.taskQueue.length === 0) return
    
    const availableWorker = this.workers.find(w => !w.busy)
    if (availableWorker) {
      const task = this.taskQueue.shift()
      this.executeTask(availableWorker, task)
    }
  }

  terminateWorker(worker) {
    worker.terminate()
    const index = this.workers.indexOf(worker)
    if (index !== -1) {
      this.workers.splice(index, 1)
    }
  }

  terminateAll() {
    this.workers.forEach(worker => worker.terminate())
    this.workers = []
    this.activeWorkers.clear()
    this.taskQueue = []
  }

  getStats() {
    return {
      totalWorkers: this.workers.length,
      activeWorkers: this.activeWorkers.size,
      queuedTasks: this.taskQueue.length,
      poolSize: this.poolSize
    }
  }
}

// Pre-configured worker pools for different tasks
export const WorkerPools = {
  compress: null,
  resize: null,
  inpaint: null,
  
  init() {
    if (typeof Worker !== 'undefined') {
      this.compress = new WorkerPool('/workers/compress.worker.js', 2)
      this.resize = new WorkerPool('/workers/resize.worker.js', 2)
      this.inpaint = new WorkerPool('/workers/inpaint.worker.js', 1)
    }
  },
  
  async compress(data) {
    if (!this.compress) {
      throw new Error('Worker pool not initialized')
    }
    return this.compress.execute(data)
  },
  
  async resize(data) {
    if (!this.resize) {
      throw new Error('Worker pool not initialized')
    }
    return this.resize.execute(data)
  },
  
  async inpaint(data) {
    if (!this.inpaint) {
      throw new Error('Worker pool not initialized')
    }
    return this.inpaint.execute(data)
  },
  
  terminateAll() {
    Object.values(this).forEach(pool => {
      if (pool && typeof pool.terminateAll === 'function') {
        pool.terminateAll()
      }
    })
  }
}

// Initialize worker pools when DOM is ready
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', () => {
    WorkerPools.init()
  })
}
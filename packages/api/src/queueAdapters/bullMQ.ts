import { Job, Queue } from 'bullmq';
import {
  JobCleanStatus,
  JobCounts,
  JobStatus,
  QueueAdapterOptions,
} from '../../typings/app';
import { BaseAdapter } from './base';

export class BullMQAdapter extends BaseAdapter {
  private readonly LIMIT = 1000;

  constructor(
    private queue: Queue,
    options: Partial<QueueAdapterOptions> = {}
  ) {
    super(options);
  }

  public async getRedisInfo(): Promise<string> {
    const client = await this.queue.client;
    return client.info();
  }

  public getName(): string {
    return this.queue.name;
  }

  public clean(jobStatus: JobCleanStatus, graceTimeMs: number): Promise<void> {
    return this.queue.clean(graceTimeMs, this.LIMIT, jobStatus);
  }

  public getJob(id: string): Promise<Job | undefined> {
    return this.queue.getJob(id);
  }

  public getJobs(
    jobStatuses: JobStatus[],
    start?: number,
    end?: number
  ): Promise<Job[]> {
    return this.queue.getJobs(jobStatuses, start, end, true);
  }

  public getJobCounts(...jobStatuses: JobStatus[]): Promise<JobCounts> {
    return (this.queue.getJobCounts(
      ...jobStatuses
    ) as unknown) as Promise<JobCounts>;
  }

  public getJobLogs(id: string): Promise<string[]> {
    return this.queue.getJobLogs(id).then(({ logs }) => logs);
  }
}

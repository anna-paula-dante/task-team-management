import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma/client';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly _client: any;

  constructor() {
    this._client = new (PrismaClient as any)();
  }

  // Model delegates
  get team() {
    return this._client.team;
  }
  get task() {
    return this._client.task;
  }

  // Transaction support
  $transaction(...args: any[]) {
    return this._client.$transaction(...args);
  }

  async onModuleInit() {
    await this._client.$connect();
  }

  async onModuleDestroy() {
    await this._client.$disconnect();
  }
}

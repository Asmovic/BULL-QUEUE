// SIMPLE QUEUE
import Bull from 'bull';
import dotenv from 'dotenv';
import { promisify } from 'util';

const sleep = promisify(setTimeout);

dotenv.config();

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

// QUEUE OPTIONS
const queueOptions = {
  redis: { host: REDIS_HOST, port: REDIS_PORT, password: REDIS_PASSWORD },
};

// DEFINE QUEUE
const burgerQueue = new Bull('burger', queueOptions);

// REGISTER PROCESSOR
burgerQueue.process(async (payload, done) => {
  try {
    // STEP 1
    payload.log('Grill the patty.');
    payload.progress(20);
    await sleep(1000);
    // STEP 2
    if (Math.random() > 0.25) throw new Error('Toast burnt!');
    payload.log('Toast the buns.');
    payload.progress(40);
    await sleep(1000);
    // STEP 3
    payload.log('Add toppings.');
    payload.progress(60);
    await sleep(1000);
    // STEP 4
    payload.log('Assemble layers.');
    payload.progress(80);
    await sleep(1000);
    // STEP 5
    payload.log('Burger ready!');
    payload.progress(100);
    done();
  } catch (err) {
    done(err);
  }
});

// ADD JOB TO THE QUEUE
const jobs = [...new Array(1)].map((_) => ({
  bun: '🐬',
  cheese: '🍔',
  toppings: ['🉑', '🥬', '🈹'],
}));

jobs.forEach((job) => burgerQueue.add(job, { jobId: `Burger#${i + 1}`, attempts: 3, repeat: { cron: "10 * * * * *"}}));

burgerQueue.on("completed", (job)=> {
  console.log(`${job.id} completed`)
})


burgerQueue.on("failed", (job)=> {
  console.log(`${job.id} failed`)
})

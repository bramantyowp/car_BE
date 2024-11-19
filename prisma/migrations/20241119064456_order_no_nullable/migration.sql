-- AlterTable
ALTER TABLE "order" ALTER COLUMN "order_no" DROP NOT NULL,
ALTER COLUMN "overdue_time" SET DEFAULT NOW() + interval '24 hours';

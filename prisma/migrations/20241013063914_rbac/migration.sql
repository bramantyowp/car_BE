-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "role" TEXT NOT NULL,
    "createdDt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedDt" TIMESTAMP(3),
    "createdBy" VARCHAR,
    "updatedBy" VARCHAR,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menu" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "route" TEXT,
    "title" TEXT NOT NULL,
    "is_submenu" BOOLEAN NOT NULL DEFAULT false,
    "method" TEXT,
    "menu_id" INTEGER,
    "createdDt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedDt" TIMESTAMP(3),
    "createdBy" VARCHAR,
    "updatedBy" VARCHAR,

    CONSTRAINT "menu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menuFeatures" (
    "id" SERIAL NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "route" TEXT,
    "method" TEXT,
    "createdDt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedDt" TIMESTAMP(3),
    "createdBy" VARCHAR,
    "updatedBy" VARCHAR,

    CONSTRAINT "menuFeatures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "menuAccess" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "menu_id" INTEGER NOT NULL,
    "visible" BOOLEAN NOT NULL,
    "createdDt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedDt" TIMESTAMP(3),
    "createdBy" VARCHAR,
    "updatedBy" VARCHAR,

    CONSTRAINT "menuAccess_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "featureAccess" (
    "id" SERIAL NOT NULL,
    "menu_access_id" INTEGER NOT NULL,
    "features_id" INTEGER NOT NULL,
    "visible" BOOLEAN NOT NULL,
    "createdDt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedDt" TIMESTAMP(3),
    "createdBy" VARCHAR,
    "updatedBy" VARCHAR,

    CONSTRAINT "featureAccess_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "menu" ADD CONSTRAINT "menu_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menuFeatures" ADD CONSTRAINT "menuFeatures_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "menuAccess" ADD CONSTRAINT "menuAccess_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "menuAccess" ADD CONSTRAINT "menuAccess_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menu"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "featureAccess" ADD CONSTRAINT "featureAccess_menu_access_id_fkey" FOREIGN KEY ("menu_access_id") REFERENCES "menuAccess"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "featureAccess" ADD CONSTRAINT "featureAccess_features_id_fkey" FOREIGN KEY ("features_id") REFERENCES "menuFeatures"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

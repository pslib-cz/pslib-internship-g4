BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Account] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [type] NVARCHAR(1000) NOT NULL,
    [provider] NVARCHAR(1000) NOT NULL,
    [providerAccountId] NVARCHAR(1000) NOT NULL,
    [refresh_token] TEXT,
    [access_token] TEXT,
    [expires_at] INT,
    [token_type] NVARCHAR(1000),
    [scope] NVARCHAR(1000),
    [id_token] TEXT,
    [session_state] NVARCHAR(1000),
    [ext_expires_in] INT,
    CONSTRAINT [Account_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Account_provider_providerAccountId_key] UNIQUE NONCLUSTERED ([provider],[providerAccountId])
);

-- CreateTable
CREATE TABLE [dbo].[Session] (
    [id] NVARCHAR(1000) NOT NULL,
    [sessionToken] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [expires] DATETIME2 NOT NULL,
    CONSTRAINT [Session_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Session_sessionToken_key] UNIQUE NONCLUSTERED ([sessionToken])
);

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [emailVerified] DATETIME2,
    [image] NVARCHAR(1000),
    [department] NVARCHAR(1000),
    [role] NVARCHAR(1000),
    [birthDate] DATETIME2,
    [phone] NVARCHAR(1000),
    [surname] NVARCHAR(1000),
    [givenName] NVARCHAR(1000),
    [street] NVARCHAR(1000),
    [descNo] INT,
    [orientNo] NVARCHAR(1000),
    [municipality] NVARCHAR(1000),
    [postalCode] INT,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[VerificationToken] (
    [identifier] NVARCHAR(1000) NOT NULL,
    [token] NVARCHAR(1000) NOT NULL,
    [expires] DATETIME2 NOT NULL,
    CONSTRAINT [VerificationToken_token_key] UNIQUE NONCLUSTERED ([token]),
    CONSTRAINT [VerificationToken_identifier_token_key] UNIQUE NONCLUSTERED ([identifier],[token])
);

-- CreateTable
CREATE TABLE [dbo].[Location] (
    [id] INT NOT NULL IDENTITY(1,1),
    [country] NVARCHAR(1000),
    [municipality] NVARCHAR(1000),
    [postalCode] INT,
    [street] NVARCHAR(1000),
    [descNo] INT,
    [orientNo] NVARCHAR(1000),
    [latitude] DECIMAL(32,16),
    [longitude] DECIMAL(32,16),
    [created] DATETIME2 NOT NULL,
    [text] TEXT,
    CONSTRAINT [Location_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Company] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [companyIdentificationNumber] INT,
    [description] NVARCHAR(1000),
    [website] NVARCHAR(1000),
    [active] BIT NOT NULL CONSTRAINT [Company_active_df] DEFAULT 1,
    [created] DATETIME2 NOT NULL,
    [creatorId] NVARCHAR(1000) NOT NULL,
    [locationId] INT NOT NULL,
    CONSTRAINT [Company_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Company_companyIdentificationNumber_key] UNIQUE NONCLUSTERED ([companyIdentificationNumber])
);

-- CreateTable
CREATE TABLE [dbo].[CompanyBranch] (
    [companyId] INT NOT NULL,
    [locationId] INT NOT NULL,
    [name] NVARCHAR(1000),
    [created] DATETIME2 NOT NULL,
    [creatorId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [CompanyBranch_pkey] PRIMARY KEY CLUSTERED ([companyId],[locationId])
);

-- CreateTable
CREATE TABLE [dbo].[Template] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [content] TEXT NOT NULL,
    CONSTRAINT [Template_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Set] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [schoolName] NVARCHAR(1000) NOT NULL,
    [active] BIT NOT NULL CONSTRAINT [Set_active_df] DEFAULT 1,
    [editable] BIT NOT NULL CONSTRAINT [Set_editable_df] DEFAULT 1,
    [start] DATETIME2 NOT NULL,
    [end] DATETIME2 NOT NULL,
    [representativeName] NVARCHAR(1000) NOT NULL,
    [representativeEmail] NVARCHAR(1000) NOT NULL,
    [representativePhone] NVARCHAR(1000) NOT NULL,
    [continuous] BIT NOT NULL,
    [hoursDaily] INT NOT NULL,
    [daysTotal] INT NOT NULL,
    [year] INT NOT NULL,
    [templateId] INT NOT NULL,
    [logoName] NVARCHAR(1000),
    CONSTRAINT [Set_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Internship] (
    [id] NVARCHAR(1000) NOT NULL,
    [companyRepName] NVARCHAR(1000) NOT NULL,
    [companyRepEmail] NVARCHAR(1000),
    [companyRepPhone] NVARCHAR(1000),
    [companyMentorName] NVARCHAR(1000) NOT NULL,
    [companyMentorEmail] NVARCHAR(1000),
    [companyMentorPhone] NVARCHAR(1000),
    [jobDescription] TEXT NOT NULL,
    [additionalInfo] TEXT,
    [appendixText] TEXT,
    [userId] NVARCHAR(1000) NOT NULL,
    [classname] NVARCHAR(1000) NOT NULL,
    [created] DATETIME2 NOT NULL,
    [creatorId] NVARCHAR(1000) NOT NULL,
    [updated] DATETIME2 NOT NULL,
    [setId] INT NOT NULL,
    [companyId] INT NOT NULL,
    [locationId] INT NOT NULL,
    [reservationUserId] NVARCHAR(1000),
    [kind] INT NOT NULL CONSTRAINT [Internship_kind_df] DEFAULT 0,
    [highlighted] BIT NOT NULL CONSTRAINT [Internship_highlighted_df] DEFAULT 0,
    [conclusion] TEXT,
    [state] INT NOT NULL CONSTRAINT [Internship_state_df] DEFAULT 0,
    CONSTRAINT [Internship_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Diary] (
    [id] INT NOT NULL IDENTITY(1,1),
    [date] DATETIME2 NOT NULL,
    [internshipId] NVARCHAR(1000) NOT NULL,
    [text] TEXT NOT NULL,
    [createdById] NVARCHAR(1000) NOT NULL,
    [created] DATETIME2 NOT NULL CONSTRAINT [Diary_created_df] DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT [Diary_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Diary_internshipId_date_key] UNIQUE NONCLUSTERED ([internshipId],[date])
);

-- CreateTable
CREATE TABLE [dbo].[Inspection] (
    [id] INT NOT NULL IDENTITY(1,1),
    [internshipId] NVARCHAR(1000) NOT NULL,
    [date] DATETIME2 NOT NULL CONSTRAINT [Inspection_date_df] DEFAULT CURRENT_TIMESTAMP,
    [inspectionUserId] NVARCHAR(1000) NOT NULL,
    [note] TEXT NOT NULL,
    [result] INT NOT NULL,
    [kind] INT NOT NULL,
    CONSTRAINT [Inspection_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Inspection_internshipId_date_key] UNIQUE NONCLUSTERED ([internshipId],[date])
);

-- CreateTable
CREATE TABLE [dbo].[Tag] (
    [id] INT NOT NULL IDENTITY(1,1),
    [text] NVARCHAR(1000) NOT NULL,
    [type] INT NOT NULL,
    [color] NVARCHAR(1000) NOT NULL,
    [background] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Tag_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[CompanyTag] (
    [companyId] INT NOT NULL,
    [tagId] INT NOT NULL,
    [created] DATETIME2 NOT NULL,
    [creatorId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [CompanyTag_pkey] PRIMARY KEY CLUSTERED ([companyId],[tagId])
);

-- CreateTable
CREATE TABLE [dbo].[Text] (
    [id] INT NOT NULL IDENTITY(1,1),
    [title] NVARCHAR(1000) NOT NULL,
    [content] TEXT NOT NULL,
    [shortable] BIT NOT NULL CONSTRAINT [Text_shortable_df] DEFAULT 1,
    [published] INT NOT NULL CONSTRAINT [Text_published_df] DEFAULT 0,
    [priority] INT NOT NULL CONSTRAINT [Text_priority_df] DEFAULT 0,
    [created] DATETIME2 NOT NULL CONSTRAINT [Text_created_df] DEFAULT CURRENT_TIMESTAMP,
    [updated] DATETIME2 NOT NULL CONSTRAINT [Text_updated_df] DEFAULT CURRENT_TIMESTAMP,
    [creatorId] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Text_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[Account] ADD CONSTRAINT [Account_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Session] ADD CONSTRAINT [Session_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Company] ADD CONSTRAINT [Company_creatorId_fkey] FOREIGN KEY ([creatorId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Company] ADD CONSTRAINT [Company_locationId_fkey] FOREIGN KEY ([locationId]) REFERENCES [dbo].[Location]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CompanyBranch] ADD CONSTRAINT [CompanyBranch_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[Company]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[CompanyBranch] ADD CONSTRAINT [CompanyBranch_locationId_fkey] FOREIGN KEY ([locationId]) REFERENCES [dbo].[Location]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[CompanyBranch] ADD CONSTRAINT [CompanyBranch_creatorId_fkey] FOREIGN KEY ([creatorId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Set] ADD CONSTRAINT [Set_templateId_fkey] FOREIGN KEY ([templateId]) REFERENCES [dbo].[Template]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Internship] ADD CONSTRAINT [Internship_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Internship] ADD CONSTRAINT [Internship_creatorId_fkey] FOREIGN KEY ([creatorId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Internship] ADD CONSTRAINT [Internship_setId_fkey] FOREIGN KEY ([setId]) REFERENCES [dbo].[Set]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Internship] ADD CONSTRAINT [Internship_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[Company]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Internship] ADD CONSTRAINT [Internship_locationId_fkey] FOREIGN KEY ([locationId]) REFERENCES [dbo].[Location]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Internship] ADD CONSTRAINT [Internship_reservationUserId_fkey] FOREIGN KEY ([reservationUserId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Diary] ADD CONSTRAINT [Diary_internshipId_fkey] FOREIGN KEY ([internshipId]) REFERENCES [dbo].[Internship]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Diary] ADD CONSTRAINT [Diary_createdById_fkey] FOREIGN KEY ([createdById]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Inspection] ADD CONSTRAINT [Inspection_internshipId_fkey] FOREIGN KEY ([internshipId]) REFERENCES [dbo].[Internship]([id]) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Inspection] ADD CONSTRAINT [Inspection_inspectionUserId_fkey] FOREIGN KEY ([inspectionUserId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[CompanyTag] ADD CONSTRAINT [CompanyTag_companyId_fkey] FOREIGN KEY ([companyId]) REFERENCES [dbo].[Company]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CompanyTag] ADD CONSTRAINT [CompanyTag_tagId_fkey] FOREIGN KEY ([tagId]) REFERENCES [dbo].[Tag]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[CompanyTag] ADD CONSTRAINT [CompanyTag_creatorId_fkey] FOREIGN KEY ([creatorId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[Text] ADD CONSTRAINT [Text_creatorId_fkey] FOREIGN KEY ([creatorId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH

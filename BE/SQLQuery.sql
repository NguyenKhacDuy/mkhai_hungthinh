CREATE TABLE dbo.[Department] (
	id int IDENTITY(1,1) PRIMARY KEY,
	departmentName nvarchar(255),
	[address] nvarchar(255),
	isActive bit,
	createdAt datetimeoffset(7), 
	updatedAt datetimeoffset(7),
);
go 

INSERT INTO dbo.[Department] (departmentName,[isActive]) VALUES
(N'Thái Thụy',1),
(N'Tiền Hải',1),
(N'Hưng Hà',0)

go

CREATE TABLE dbo.[User] (
	id int IDENTITY(1,1), 
	fullname nvarchar(255), 
	dob nvarchar(255), 
	username nvarchar(255),
	[password] nvarchar(255),
	[address] nvarchar(255), 
	phone nvarchar(20), 
	isActive bit, 
	[role] int, 
	departmentId int,
	createdAt datetimeoffset(7), 
	updatedAt datetimeoffset(7),
	CONSTRAINT PK_USER PRIMARY KEY(id),
	CONSTRAINT FK_DEPARTMENT FOREIGN KEY (departmentId) REFERENCES [Department](id)
);

go

INSERT INTO dbo.[User] ([fullname],[dob],[username],[password],[phone],[isActive],[role],[departmentId],[createdAt],[updatedAt],[address]) VALUES 
(N'Nhữ Văn Duy', '', 'admin', 'fEqNCco3Yq9h5ZUglD3CZJT4lBs=', '123', '1', 0, 1, '', '', N'Hà Nội'),
(N'Vũ Tiến Việt', '', 'director', 'fEqNCco3Yq9h5ZUglD3CZJT4lBs=', '123', '1', 1, 1, '', '', N'Hà Nội'),
(N'Nguyễn Khắc Duy', '', 'accountant', 'fEqNCco3Yq9h5ZUglD3CZJT4lBs=', '123', '1', 2, 1, '', '', N'Hà Nội')

go

CREATE TABLE dbo.[License] (
	id int IDENTITY(1,1) PRIMARY KEY,
	content nvarchar(MAX),
	note nvarchar(MAX),
	cancelReason nvarchar(MAX),
	[money] float,
	createdAt datetimeoffset(7),
	updatedAt datetimeoffset(7),
	[status] int,
	creatorId int,
	approverId int,
	accountantId int,
	departmentId int,
	images nvarchar(MAX),
	CONSTRAINT FK_DEPT_LICENSE FOREIGN KEY (departmentId) REFERENCES Department(id),
	CONSTRAINT FK_CREATOR FOREIGN KEY (creatorId) REFERENCES [USER](id),
	CONSTRAINT FK_APPROVER FOREIGN KEY (approverId) REFERENCES [USER](id),
	CONSTRAINT FK_ACCOUNTANT FOREIGN KEY (accountantId) REFERENCES [USER](id)
);
go

INSERT INTO dbo.[License] ([content],[note],[money],[createdAt],[updatedAt],[status],creatorId,departmentId) VALUES
(N'Nội dung chứng từ',N'Ghi chú',12500000,'','',0,1,1),
(N'Nội dung chứng từ 1',N'Ghi chú 1',12600000,'','',0,1,1),
(N'Nội dung chứng từ 2',N'Ghi chú 2',14500000,'','',0,1,1),
(N'Nội dung chứng từ chú 3',N'Ghi chú 3',12800000,'','',0,1,1)

go

CREATE TABLE dbo.[Document] (
	id int identity(1,1) PRIMARY KEY,
	title nvarchar(MAX),
	content nvarchar(MAX),
	isActive bit,
	[type] int,
	creatorId int,
	departmentId int,
	files nvarchar(MAX),
	createdAt datetimeoffset(7),
	updatedAt datetimeoffset(7)
	CONSTRAINT FK_DOCUMENT_CREATOR FOREIGN KEY (creatorId) REFERENCES [USER](id),
	CONSTRAINT FK_DEPT_DOCUMENT FOREIGN KEY (departmentId) REFERENCES Department(id),
);

INSERT INTO [dbo].[Document]([title],[content],[isActive],[type],[creatorId],[departmentId],[files],[createdAt],[updatedAt])
VALUES ('abc','chi mua xe 2',1,1,1,1,'','2020-08-15 08:55:19.9300000 +00:00','2020-08-15 08:55:19.9300000 +00:00'),
VALUES ('abc','chi mua xe 2',1,1,1,1,'','2020-08-15 08:55:19.9300000 +00:00','2020-08-15 08:55:19.9300000 +00:00'),
VALUES ('abc','chi mua xe 2',1,1,1,1,'','2020-08-15 08:55:19.9300000 +00:00','2020-08-15 08:55:19.9300000 +00:00'),
VALUES ('abc','chi mua xe 2',1,1,1,1,'','2020-08-15 08:55:19.9300000 +00:00','2020-08-15 08:55:19.9300000 +00:00'),
VALUES ('abc','chi mua xe 2',1,1,1,1,'','2020-08-15 08:55:19.9300000 +00:00','2020-08-15 08:55:19.9300000 +00:00'),
VALUES ('abc','chi mua xe 2',1,1,1,1,'','2020-08-15 08:55:19.9300000 +00:00','2020-08-15 08:55:19.9300000 +00:00'),
VALUES ('abc','chi mua xe 2',1,1,1,1,'','2020-08-15 08:55:19.9300000 +00:00','2020-08-15 08:55:19.9300000 +00:00'),
VALUES ('abc','chi mua xe 2',1,1,1,1,'','2020-08-15 08:55:19.9300000 +00:00','2020-08-15 08:55:19.9300000 +00:00'),
VALUES ('abc','chi mua xe 2',1,1,1,1,'','2020-08-15 08:55:19.9300000 +00:00','2020-08-15 08:55:19.9300000 +00:00'),
VALUES ('abc','chi mua xe 2',1,1,1,1,'','2020-08-15 08:55:19.9300000 +00:00','2020-08-15 08:55:19.9300000 +00:00'),
VALUES ('abc','chi mua xe 2',1,1,1,1,'','2020-08-15 08:55:19.9300000 +00:00','2020-08-15 08:55:19.9300000 +00:00'),
VALUES ('abc','chi mua xe 2',1,1,1,1,'','2020-08-15 08:55:19.9300000 +00:00','2020-08-15 08:55:19.9300000 +00:00'),
VALUES ('abc','chi mua xe 2',1,1,1,1,'','2020-08-15 08:55:19.9300000 +00:00','2020-08-15 08:55:19.9300000 +00:00'),
VALUES ('abc','chi mua xe 2',1,1,1,1,'','2020-08-15 08:55:19.9300000 +00:00','2020-08-15 08:55:19.9300000 +00:00'),
VALUES ('abc','chi mua xe 2',1,1,1,1,'','2020-08-15 08:55:19.9300000 +00:00','2020-08-15 08:55:19.9300000 +00:00'),
VALUES ('abc','chi mua xe 2',1,1,1,1,'','2020-08-15 08:55:19.9300000 +00:00','2020-08-15 08:55:19.9300000 +00:00'),
VALUES ('abc','chi mua xe 2',1,1,1,1,'','2020-08-15 08:55:19.9300000 +00:00','2020-08-15 08:55:19.9300000 +00:00'),
VALUES ('abc','chi mua xe 2',1,1,1,1,'','2020-08-15 08:55:19.9300000 +00:00','2020-08-15 08:55:19.9300000 +00:00'),
VALUES ('abc','chi mua xe 2',1,1,1,1,'','2020-08-15 08:55:19.9300000 +00:00','2020-08-15 08:55:19.9300000 +00:00'),
VALUES ('abc','chi mua xe 2',1,1,1,1,'','2020-08-15 08:55:19.9300000 +00:00','2020-08-15 08:55:19.9300000 +00:00'),
VALUES ('abc','chi mua xe 2',1,1,1,1,'','2020-08-15 08:55:19.9300000 +00:00','2020-08-15 08:55:19.9300000 +00:00'),
VALUES ('abc','chi mua xe 2',1,1,1,1,'','2020-08-15 08:55:19.9300000 +00:00','2020-08-15 08:55:19.9300000 +00:00'),
VALUES ('abc','chi mua xe 2',1,1,1,1,'','2020-08-15 08:55:19.9300000 +00:00','2020-08-15 08:55:19.9300000 +00:00'),
VALUES ('abc','chi mua xe 2',1,1,1,1,'','2020-08-15 08:55:19.9300000 +00:00','2020-08-15 08:55:19.9300000 +00:00'),
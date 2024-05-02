import bcrypt from "bcrypt";

export default (sequelize: any, DataTypes: any) => {
  const User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: true },
      email: { type: DataTypes.STRING, allowNull: true },
      username: { type: DataTypes.STRING, allowNull: true },
      cellphone: { type: DataTypes.STRING, allowNull: true },
      rol: { type: DataTypes.STRING, allowNull: true },
      businessId: { type: DataTypes.INTEGER, allowNull: true },
      currentViewId: { type: DataTypes.INTEGER, allowNull: true },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        set(password: string) {
          let objThis: any = this;
          let pass = bcrypt.hashSync(password, 10);
          objThis.setDataValue("password", pass);
        },
      },
      blockedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: false,
      },
      lastActionAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: false,
      },
      mfa: {
        type: DataTypes.TEXT,
        get() {
          let objThis: any = this;
          const json = objThis.getDataValue("mfa");
          return JSON.parse(json || "{}");
        },
        set(value: any) {
          let objThis: any = this;
          objThis.setDataValue("mfa", JSON.stringify(value));
        },
      },
    },
    {
      paranoid: true,
      tableName: "users",
    }
  );

  User.associate = function (models: any) {
    models.User.belongsTo(models.Business);
    // models.User.belongsTo(models.Commerce);
    // models.User.belongsTo(models.Country);
    // models.User.belongsTo(models.Rol);
  };
  /**
   *Check Permission
   *@return new token
   */
  User.prototype.can = async function (permission: string) {
    let db = sequelize.models;

    let queryBuilder = {
      attributes: ["id"],
      include: [
        {
          attributes: ["key"],
          model: db.RolPrivilege,
          required: true,
          where: {
            key: permission,
          },
        },
      ],
      where: {
        rolId: this.rolId,
      },
    };
    let count = await db.RolPermission.count(queryBuilder);
    return count > 0;
  };

  /**
   *Check Permission
   *@return new token
   */
  User.prototype.permissions = async function () {
    let db = sequelize.models;

    let queryBuilder = {
      attributes: ["id"],
      include: [
        {
          name: "key",
          model: db.RolPrivilege,
          required: true,
        },
      ],
      where: {
        rolId: this.rolId,
      },
    };
    return (await db.RolPermission.findAll(queryBuilder)).map(
      (permission: any) => permission.RolPrivilege.key
    );
  };

  /**
   *Find user by her id
   *@return corresponfing user
   */
  User.findById = async function (id: string) {
    return await User.findByPk(id);
  };

  User.findByToken = async function (token: string) {
    let session = await sequelize.models.Session.findOne({
      include: [
        {
          model: User,
          required: true,
        },
      ],
      where: {
        token,
      },
    });
    return session?.User;
  };
  /**
   *Find user by her username
   *@return corresponfing user
   */
  User.findByEmail = async function (email: string) {
    let queryBuilder = {
      where: {
        email,
      },
    };
    let user = await User.findOne(queryBuilder);
    return user;
  };

  User.findByCellphone = async function (cellphone: string) {
    let queryBuilder = {
      where: {
        cellphone,
      },
    };
    let user = await User.findOne(queryBuilder);
    return user;
  };

  User.findByUsername = async function (username: string) {
    let queryBuilder = {
      where: {
        username,
      },
    };
    let user = await User.findOne(queryBuilder);
    return user;
  };
  /**
   *Compare two passwords
   *@return if they correspond or not
   */
  User.prototype.matchPassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
  };
  /**
   *Create and set the two secure factor code and her expiration
   *@return twoFactorCode and twoFactorExpiration
   */
  User.prototype.createTwoFactor = async function () {
    let db = sequelize.models;
    let moreTime = await db.Parameter.findByKey("TWO_FACTOR_ACTIVE");
    let twoFactorCode = Math.floor(100000 + Math.random() * 999999);
    // let twoFactorExpiration = moment()
    //   .add(moreTime, "minutes")
    //   .format("YYYY-MM-DD HH:mm:ss");
    let twoFactorExpiration = null;

    await this.update({
      twoFactorCode,
      twoFactorExpiration,
    });
    return { twoFactorCode, twoFactorExpiration };
  };
  /**
   *Verify if the codes are the same
   *@return true or false
   */
  User.prototype.checkTwoFactor = async function (code: string) {
    return this.twoFactorCode == code;
  };
  /**
   *Verify if a expiration code is active or inactive
   *@return true or false
   */
  User.prototype.checkActiveTwoFactor = async function () {
    let db = sequelize.models;
    let moreTime = await db.Parameter.findByKey("TWO_FACTOR_ACTIVE");
    // let difference = moment(this.twoFactorExpiration).diff(moment(), "minutes");
    let difference = 10;
    return difference > moreTime;
  };
  /**
   *Clean the colums twoFactorCode and twoFactorExpiration
   *@return true or false
   */
  User.prototype.cleanTwoFactor = async function () {
    await this.update({
      twoFactorCode: null,
      twoFactorExpiration: null,
    });
  };
  /**
   *Create and set the two secure factor code and her expiration
   *@return RestoreToken and RestoreTokenExpiration
   */
  User.prototype.createRestoreToken = async function () {
    // let db = sequelize.models;
    // let moreTime = await db.Parameter.findByKey('RESTORE_TOKEN_ACTIVE');
    let restoreToken = Math.floor(100000 + Math.random() * 900000);

    // let restoreToken = Math.random().toString(36).substring();
    // let restoreTokenExpiration = moment()
    //   .add(60, "minutes")
    //   .format("YYYY-MM-DD HH:mm:ss");
    let restoreTokenExpiration = null;
    await this.update({
      restoreToken,
      restoreTokenExpiration,
    });
    return { restoreToken, restoreTokenExpiration };
  };
  /**
   *Verify if the codes are the same
   *@return true or false
   */
  User.prototype.checkRestoreToken = async function (code: string) {
    return this.restoreToken == code;
  };
  /**
   *Verify if a expiration code is active or inactive
   *@return true or false
   */
  User.prototype.checkActiveRestoreToken = async function () {
    let db = sequelize.models;
    let moreTime = await db.Parameter.findByKey("RESTORE_TOKEN_ACTIVE");
    // let difference = moment(this.restoreTokenExpiration).diff(
    //   moment(),
    //   "minutes"
    // );
    let difference = 10;
    return difference > moreTime; // La diferencia es mayor a la limite del parametro
  };
  /**
   *Clean the colums RestoreToken and RestoreTokenExpiration
   *@return true or false
   */
  User.prototype.cleanRestoreToken = async function () {
    await this.update({
      restoreToken: null,
      restoreTokenExpiration: null,
    });
  };
  /**
   *Clean the colums RestoreToken and RestoreTokenExpiration
   *@return true or false
   */
  User.prototype.closeSessions = async function () {
    let queryBuilder = {
      where: {
        userId: this.id,
        active: 1,
      },
    };
    await sequelize.models.Session.update(
      {
        active: 0,
        closeMotive: "user.changePassword",
      },
      queryBuilder
    );
  };

  User.exists = async function (cellphone: string, docNumber: string) {
    let queryBuilder: any = {
      paranoid: false,
      where: {
        cellphone,
      },
    };
    let user = await User.findOne(queryBuilder);
    if (!user && docNumber) {
      queryBuilder = {
        paranoid: false,
        where: {
          docNumber,
        },
      };
      user = await User.findOne(queryBuilder);
    }
    return user;
  };

  User.prototype.validateOtp = function (token: string) {
    // return speakeasy.totp.verify({
    //   secret: this.hashMFA,
    //   encoding: "base32",
    //   token,
    // });
  };

  User.prototype.loginData = async function (session: any) {
    // let business = await this.getBusiness();
    // let parent = business?.parentId ? await business.getParent() : null;

    return {
      id: this.id,
      useDarkMode: this.useDarkMode,
      token: session.token,
      sessionId: session.id,
      businessId: this.businessId,
      confirmCellphone: this.confirmCellphone,
      confirmatedCellphone: this.confirmatedCellphone,
      confirmatedMFA: this.confirmatedMFA,
      vinculateMFA: this.mandatory2FA && !this.confirmatedMFA,
      rol: this.rol,
      // Rol: {
      //   permissions: await this.permissions(),
      // },
      // Support: parent
      //   ? {
      //       id: parent.id,
      //       name: parent.name,
      //       cellphone: parent.cellphone,
      //     }
      //   : null,
    };
  };

  return User;
};

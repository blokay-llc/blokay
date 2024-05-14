import fetch from "node-fetch";

export default class Core {
  private secretKey = "";

  constructor(coreToken: string) {
    this.secretKey = coreToken;
  }

  async fetchCore(path: string, data: any) {
    const endpoint = process.env.CORE_URL || "https://blokay.com";

    const response = await fetch(endpoint + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.secretKey}`,
      },
      body: JSON.stringify({
        data,
      }),
    });

    const result: any = await response.json();

    return result;
  }

  async getFn(
    description: string,
    synapse: string,
    prompt: string,
    fields: any[],
    structure: any,
    neuronList: any[]
  ) {
    let result = await this.fetchCore("/api/ai/exec", {
      description,
      synapse,
      prompt,
      fields,
      structure,
      neuronList,
    });

    result = result.data.Result;

    return {
      description: result.description,
      synapse: result.synapse,
    };
  }

  async newBusiness(
    personName: string,
    companyName: string,
    companySize: string,
    email: string
  ) {
    let result = await this.fetchCore("/api/core/newBusiness", {
      personName,
      companyName,
      companySize,
      email,
    });

    result = result.data.Result;

    return {
      coreToken: result.coreToken,
    };
  }

  async saveCard(token: string, lastFour: string, email: string) {
    let result = await this.fetchCore("/api/core/saveCard", {
      token,
      lastFour,
      email,
    });

    result = result.data.Result;

    return {};
  }
}

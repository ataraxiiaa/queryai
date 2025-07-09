import UserModel from "@/model/user";
import { DynamicTool } from "@langchain/core/tools";


export const UserQuery = new DynamicTool({
    name: "user_query",
    description: "You are an AI Agent that would be help querying the database. Input should be a MongoDB query in JSON format and please listen to the users query.",
    func: async(input : string) => {
        try {
            const query = JSON.parse(input)
            const users = await UserModel.find(query).exec();
            return JSON.stringify(users,null,2)
        }
        catch(error) {
            console.error("Error querying users:", error);
        }
    }
})
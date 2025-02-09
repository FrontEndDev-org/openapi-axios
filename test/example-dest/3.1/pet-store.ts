/**
 * 由 pkg-name-for-test@pkg-version-for-test 生成，参考下述文档链接，忽略此文件的格式校验
 *
 * - [ESLint](https://eslint.org/docs/latest/use/configure/ignore)
 * - [Prettier](https://prettier.io/docs/en/ignore.html)
 * - [Biome](https://biomejs.dev/guides/configure-biome/#ignore-files)
 */

/**
 * @title Swagger Petstore - OpenAPI 3.1
 * @version 1.0.7
 * @contact <apiteam@swagger.io>
 * @description This is a sample Pet Store Server based on the OpenAPI 3.1 specification.
 * You can find out more about
 * Swagger at [http://swagger.io](http://swagger.io).
 * @summary Pet Store 3.1
 * @see {@link http://swagger.io Find out more about Swagger}
 */

import axios from "axios";
import {type AxiosRequestConfig as AxiosRequestConfig} from "axios";
import {type AxiosResponse as AxiosResponse} from "axios";


/**
 * @description Category
 */
export type Category = {
/**
 * @format int64
 * @example 1
 */
"id"?:number;
/**
 * @example Dogs
 */
"name"?:string;
};

/**
 * @description Pet
 */
export type Pet = {
/**
 * @format int64
 * @example 10
 */
"id"?:number;
/**
 * @description Pet Category
 */
"category"?:Category;
/**
 * @example doggie
 */
"name":string;
"photoUrls":Array<string>;
"tags"?:Array<Tag>;
/**
 * @description pet status in the store
 */
"status"?:("available"|"pending"|"sold");
/**
 * @format int32
 * @example 7
 */
"availableInstances"?:number;
"petDetailsId"?:PetDetailsPetDetailsId;
"petDetails"?:PetDetails;
};

export type PetDetails = {
/**
 * @format int64
 * @example 10
 */
"id"?:number;
/**
 * @description PetDetails Category
 */
"category"?:Category;
"tag"?:Tag;
};

/**
 * @format int64
 * @example 10
 */
export type PetDetailsPetDetailsId = number;

export type Tag = {
/**
 * @format int64
 */
"id"?:number;
"name"?:string;
};

export type UpdatePetData = 
/**
 * @description A Pet in JSON Format
 */
Pet
;
export type UpdatePetResponse = 
/**
 * @description A Pet in XML Format
 */
Pet
;

/**
 * @description Update an existing pet by Id
 * @summary Update an existing pet
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param data Pet object that needs to be updated in the store
 * @param [config] request config
 * @returns Successful operation
 */
export async function updatePet(data:UpdatePetData,config?:AxiosRequestConfig): Promise<AxiosResponse<UpdatePetResponse>> {
    return axios({
        method: "PUT",
        url: `/pet`,
data: data,
...config
    });
}

export type AddPetData = 
/**
 * @description A Pet in JSON Format
 */
Pet
;
export type AddPetResponse = 
/**
 * @description A Pet in XML Format
 */
Pet
;

/**
 * @description Add a new pet to the store
 * @summary Add a new pet to the store
 * @see pet Everything about your Pets {@link http://swagger.io Find out more}
 * @param data Create a new pet in the store
 * @param [config] request config
 * @returns Successful operation
 */
export async function addPet(data:AddPetData,config?:AxiosRequestConfig): Promise<AxiosResponse<AddPetResponse>> {
    return axios({
        method: "POST",
        url: `/pet`,
data: data,
...config
    });
}

export type GetPetByIdPath = 
/**
 * @description param ID of pet that needs to be fetched
 * @format int64
 */
number
;

/**
 * @description Returns a pet when 0 < ID <= 10.  ID > 10 or nonintegers will simulate API error conditions
 * @summary Find pet by ID
 * @param petId ID of pet that needs to be fetched
 * @param [config] request config
 */
export async function getPetById(petId:GetPetByIdPath,config?:AxiosRequestConfig): Promise<AxiosResponse<unknown>> {
    return axios({
        method: "GET",
        url: `/pet/${petId}`,
...config
    });
}
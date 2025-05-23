const Joi = require('joi');

const createJob = {
    body: Joi.object().keys({
        jobTitle: Joi.string().required("Job title is required"),
        employmentType: Joi.string().required(),
        status: Joi.string().valid('expired', 'active').required(),
        location: Joi.string().required(),
        isAdmin: Joi.boolean().default(false),
        company: Joi.string().required(),
        salaryRange: Joi.number().optional(),
        experienceLevel: Joi.string().optional(),
        applicationLastDate: Joi.date().optional(),
        seniority: Joi.string().optional(),
        skills: Joi.array().items(Joi.string()).optional(),
        jobDescription: Joi.string().optional(),
        yourScope: Joi.string().optional(),
        jobResponsibilities: Joi.string().optional(),
        positionRequirements: Joi.string().optional(),
        whatInForYou: Joi.string().optional(),
        deliverables: Joi.string().optional(),
        meetTheTeamImage: Joi.string().optional(),
        allApplicants: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),  // ObjectId format
        shortlistedApplicants: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
        totalNumberOfApplicants: Joi.number().optional()
    }),
};

const applicationValidation = {
    body: Joi.object().keys({
        jobPostId: Joi.string().optional().regex(/^[0-9a-fA-F]{24}$/), // ObjectId validation
        userId: Joi.string().optional().regex(/^[0-9a-fA-F]{24}$/), // ObjectId validation
        cv: Joi.string().optional().allow(''),
        coverLetter: Joi.string().optional().allow(''),
        sortVideo: Joi.string().optional().allow('')
    }),
};

module.exports = {
    createJob,
    applicationValidation
};

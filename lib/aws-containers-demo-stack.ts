import cdk = require('@aws-cdk/core');
import codebuild = require('@aws-cdk/aws-codebuild');
import codepipeline = require('@aws-cdk/aws-codepipeline');
import codepipeline_actions = require('@aws-cdk/aws-codepipeline-actions');
import codecommit = require('@aws-cdk/aws-codecommit');
import iam = require('@aws-cdk/aws-iam');
import ecr = require('@aws-cdk/aws-ecr');

export class AwsContainersDemoStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The ECR repository we will get built by our Code Pipeline
    const ecr_repo = new ecr.Repository(this, 'ecrRepository');

    // CodeCommit repository that contains the Dockerfile used to build our ECR image: 
    const code_repo = new codecommit.Repository(this, 'codeRepository', {
      repositoryName: 'container-image-repo'
    });

    // Pipeline that triggers on pushes to CodeCommit repo to build our ECR image: 
    const pipeline = new codepipeline.Pipeline(this, 'EcrPipeline', {
      pipelineName: 'EcrPipeline'
    });

    // Configure our pipeline to pull in our Code Commit repo as the pipeline source: 
    const sourceOutput = new codepipeline.Artifact();
    const sourceAction = new codepipeline_actions.CodeCommitSourceAction({
      actionName: 'CodeCommit',
      repository: code_repo,
      output: sourceOutput
    });
    pipeline.addStage({
      stageName: 'Source',
      actions: [sourceAction]
    });
    
    /**
     * Add a CodeBuild project to our pipeline to build a Dockerfile into an 
     * image and push it to ECR.
     * 
     * Note - In order for the project to actually do this, the source code pushed
     * to the CodeCommit repo needs to have a properly defined buildspec.yml and
     * Dockerfile. At this time, example files are in my GitHub project, but you
     * will have to push them to CodeCommit. Later, I may look at somehow initializing
     * CodeCommit with an initial example file via custom resources.
     */
    const project = new codebuild.PipelineProject(this, 'MyProject', {
      environmentVariables: {
        // It is expected that our buildspec.yml in our source code will reference
        // this environment variable to determine which ECR repo to push the built image. 
        ECR_REPOSITORY_URI: {
          type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
          value: ecr_repo.repositoryUri
        }
      },
      // privileged = true is needed in order to run docker build:
      environment: {
        privileged: true
      }
    });

    project.addToRolePolicy(new iam.PolicyStatement({
      resources: [ecr_repo.repositoryArn],
      actions: ['ecr:*'],         // This could be further scoped down...
      effect: iam.Effect.ALLOW
    }));

    const buildAction = new codepipeline_actions.CodeBuildAction({
      actionName: 'CodeBuild',
      project,
      input: sourceOutput
    });
    pipeline.addStage({
      stageName: 'Build',
      actions: [buildAction]
    });
  }
}

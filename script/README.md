# Document Importing:

Currently only PDF available until I get more time to research. This script is kinda hacky but it works.
You may want to adjust the chunk size, it's currently set to 1000. I'm thinking it may be a bit too small.
If you want to make some improvements feel free to do so and open up a PR.

## Setup:

Running the following command should install the deps required to use this script.

```
pip install -r requirements.txt
```

You'll need to setup another .env file in the directory of the script. Should look like this:

```
OPEN_AI_KEY=openAI key
PINECONE_API=pinecone API key
MONGODB=mongodb://localhost:27017 --- Your connection to Mongodb
PINECONE_ENV=us-east1-gcp --- Environment found on Pinecone site
pinecone_index=name of your index
mongo_db_name=mongo database name
```

#### How to Use:

Just drop your PDFs into the docs folder and then run the script, it should show up as an option in the menu.
Keep in mind splitting the PDF does take awhile and it may look like nothing is happening. It can take several
minutes to complete.

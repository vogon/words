require 'json'
require 'sinatra'
require 'slim'

require './poem'

POEMS = [nil]

class WordsAPI < Sinatra::Base
	get '/api/newpoem' do
		result = {
			id: 0,
			words: ["foo", "bar", "baz"]
		}

		JSON.dump(result)
	end

	post '/api/submitpoem' do
		lines = JSON.parse(request.body.read)

		POEMS << Poem.new(lines)

		200
	end

	get "/api/poem/:id" do
		poem = POEMS[params[:id].to_i]

		if poem then
			poem.to_json
		else
			204
		end
	end

	get '/' do
		slim :compose_page_words
	end
end
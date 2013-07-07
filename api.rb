require 'json'
require 'sinatra'
require 'slim'

require './poem'
require './theme'

THEMES = Theme.loadAll("./wordlists")
print THEMES

POEMS = []

class WordsAPI < Sinatra::Base
	get '/api/themes' do
		themes = THEMES.map { |th| th.theme }

		return JSON.dump(themes)
	end

	get '/api/newpoem/:theme_id' do
		theme_id = params[:theme_id].to_i
		return 204 if theme_id == 0

		result = {
			id: 0,
			words: THEMES[theme_id - 1].words
		}

		return JSON.dump(result)
	end

	post '/api/submitpoem' do
		lines = JSON.parse(request.body.read)
		print lines

		POEMS << Poem.new(lines)

		200
	end

	get "/api/poem/:id" do
		poem_id = params[:id].to_i
		return 204 if poem_id == 0

		poem = POEMS[poem_id - 1]

		if poem then
			return poem.to_json
		else
			return 204
		end
	end

	get '/' do
		slim :compose_page_words
	end
end
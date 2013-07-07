require 'json'
require 'sinatra'
require 'slim'

require './poem'
require './theme'

THEMES, COMMON_THEME = Theme.loadAll("./wordlists")
print THEMES

require './dbmodels'

initialize_models?

POEMS = {}

Db::Poem.all.each do |dbpoem|
	poem = Poem.depersist(dbpoem)
	POEMS[poem.id] = poem
end

HN_VIEW_API = false

class WordsAPI < Sinatra::Base
	get '/api/themes' do
		themes = {}

		THEMES.each_with_index do |theme, i|
			themes[i + 1] = theme.theme
		end

		return JSON.dump(themes)
	end

	get '/api/newpoem/:theme_id' do
		theme_id = params[:theme_id].to_i
		return 204 if theme_id == 0

		words = THEMES[theme_id - 1].words
		words += COMMON_THEME.words if COMMON_THEME

		result = {
			id: 0,
			theme: THEMES[theme_id - 1].theme,
			words: words
		}

		return JSON.dump(result)
	end

	post '/api/submitpoem' do
		poem = JSON.parse(request.body.read)
		print poem

		next_id = POEMS.keys.max + 1
		poem = Poem.new(next_id, poem["title"], poem["author"], poem["lines"])

		POEMS[next_id] = poem
		poem.persist!

		200
	end

	get "/api/poem/:id" do
		poem_id = params[:id].to_i
		poem = POEMS[poem_id]

		if poem then
			return poem.to_json
		else
			return 204
		end
	end

	if HN_VIEW_API
		get '/api/newest' do
			# sort poems by id, descending
			poems_by_id = POEMS.sort_by { |poem| -poem.id }
			result = poems_by_id.take(10)

			print result.inspect

			return JSON.dump(result)
		end

		get '/api/haughtiest' do
			# sort poems by haughtiness, descending
			poems_by_haughtiness = POEMS.sort_by { |poem| -poem.haughty }
			result = poems_by_haughtiness.take(10)

			return JSON.dump(result)
		end

		get '/api/naughtiest' do
			# sort poems by naughtiness, descending
			poems_by_naughtiness = POEMS.sort_by { |poem| -poem.naughty }
			result = poems_by_naughtiness.take(10)

			return JSON.dump(result)
		end
	end

	post '/api/haughtify/:id' do
		poem_id = params[:id].to_i
		poem = POEMS[poem_id]

		print poem.inspect

		if poem then
			poem.haughty += 1
			poem.persist!

			result = {haughty: poem.haughty, naughty: poem.naughty}
			return JSON.dump(result)
		else
			return 204
		end
	end

	post '/api/naughtify/:id' do
		poem_id = params[:id].to_i
		poem = POEMS[poem_id]

		if poem then
			poem.naughty += 1
			poem.persist!

			result = {haughty: poem.haughty, naughty: poem.naughty}
			return JSON.dump(result)
		else
			return 204
		end
	end

	get '/' do
		slim :compose_page_words
	end

	get '/poems' do
		# sort poems by id, descending
		poems_by_id = POEMS.values.sort_by { |poem| -poem.id }
		result = poems_by_id.take(10)

		slim :view_page, locals: {poems: result, header: :new}
	end

	get '/poems/haughtiest' do
		# sort poems by haughtiness, descending
		poems_by_haughtiness = POEMS.values.sort_by { |poem| -poem.haughty }
		result = poems_by_haughtiness.take(10)

		slim :view_page, locals: {poems: result, header: :haughty}
	end

	get '/poems/naughtiest' do
		# sort poems by naughtiness, descending
		poems_by_naughtiness = POEMS.values.sort_by { |poem| -poem.naughty }
		result = poems_by_naughtiness.take(10)

		slim :view_page, locals: {poems: result, header: :naughty}
	end
end
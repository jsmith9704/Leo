/* LEO — Supabase client + database functions */
(function () {
  const SUPABASE_URL = "https://canbqmcwafioahmpmhcp.supabase.co";
  const SUPABASE_KEY = "sb_publishable_nrPbtF3ytjGjlGrJjnNPkw_2w07uAzU";
  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  async function signIn(email, password) {
    const {
      data,
      error
    } = await client.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  }
  async function signOut() {
    const {
      error
    } = await client.auth.signOut();
    if (error) throw error;
  }
  async function getSession() {
    const {
      data,
      error
    } = await client.auth.getSession();
    if (error) throw error;
    return data.session;
  }
  function onAuthChange(callback) {
    return client.auth.onAuthStateChange((_event, session) => {
      callback(session);
    });
  }
  async function getProfile(userId) {
    const {
      data,
      error
    } = await client.from("analyst_profiles").select("*").eq("id", userId).single();
    if (error) return null;
    return data;
  }
  async function loadNotes(findingId, workflowId) {
    const {
      data,
      error
    } = await client.from("investigation_notes").select("*").eq("finding_id", findingId).eq("workflow_id", workflowId).single();
    if (error) return null;
    return data;
  }
  async function saveNotes({
    findingId,
    workflowId,
    notes,
    resolutionStatus,
    verificationSteps,
    userName
  }) {
    const {
      data: {
        session
      }
    } = await client.auth.getSession();
    const userId = session ? session.user.id : null;
    const {
      data,
      error
    } = await client.from("investigation_notes").upsert({
      finding_id: findingId,
      workflow_id: workflowId,
      notes: notes,
      resolution_status: resolutionStatus,
      verification_steps: Array.from(verificationSteps),
      last_updated_by: userId,
      last_updated_by_name: userName || null,
      updated_at: new Date().toISOString()
    }, {
      onConflict: "finding_id,workflow_id"
    }).select().single();
    if (error) {
      console.error("saveNotes error:", error);
      return null;
    }

    // Insert audit trail row
    await client.from("audit_trail").insert({
      finding_id: findingId,
      workflow_id: workflowId,
      analyst_id: userId,
      analyst_name: userName || null,
      action: "save_notes",
      details: {
        resolution_status: resolutionStatus,
        verification_steps_count: verificationSteps.size || verificationSteps.length || 0
      }
    });
    return data;
  }
  window.LEO_DB = {
    signIn,
    signOut,
    getSession,
    onAuthChange,
    getProfile,
    loadNotes,
    saveNotes
  };
})();